import * as R from 'ramda';
import request from 'superagent';

const getArrayFromProp = (prop = '') => R.pipe(R.prop(prop), R.defaultTo([]));
const getArrayFromPath = (path = []) => R.pipe(R.path(path), R.defaultTo([]));

export const getAccountId = R.pipe(R.replace('.atlassian.net', ''), R.trim);

export const getRapidViewId = R.pipe(
  R.match(/rapidView=(\d+)/),
  R.prop(1),
  R.defaultTo(null)
);

export const addPointsByCategory = (
  assigneePoints = {},
  statusCategory,
  pointsToAdd
) =>
  R.over(
    R.lensProp(statusCategory),
    R.pipe(R.defaultTo(0), R.add(pointsToAdd)),
    assigneePoints
  );

export const getStatusCategoryMap = mappedColumns =>
  R.pipe(
    R.map(getArrayFromProp('mappedStatuses')),
    R.unnest,
    R.map(status => {
      const statusId = status.id;
      const statusCategory = getArrayFromPath(['statusCategory', 'key'])(
        status
      );
      return [statusId, statusCategory];
    }),
    R.filter(([statusId, statusCategory]) => statusId && statusCategory),
    R.fromPairs
  )(mappedColumns);

export const getAssigneesFromIssues = issues =>
  R.pipe(
    R.uniqBy(R.prop('assignee')),
    R.filter(R.prop('assignee')),
    R.map(issue => [
      issue.assignee,
      {
        id: issue.assignee,
        name: issue.assigneeName,
        avatarUrl: issue.avatarUrl,
      },
    ]),
    R.fromPairs
  )(issues);

export const getIssuesById = (issues, statusCategoryMap) =>
  R.pipe(
    R.map(issue => [
      issue.id,
      {
        assigneeId: issue.assignee,
        points:
          R.path(['estimateStatistic', 'statFieldValue', 'value'], issue) || 0,
        statusCategory: statusCategoryMap[issue.statusId],
      },
    ]),
    R.fromPairs
  )(issues);

export const getAssigneesBySprint = (assignees, issuesById, issuesIds) =>
  R.pipe(
    R.map(issueId => issuesById[issueId]),
    R.filter(
      ({ assigneeId, points = 0, statusCategory }) =>
        assigneeId && points && statusCategory
    ),
    R.map(issue => issue.assigneeId),
    R.uniq,
    R.map(assigneeId => [assigneeId, assignees[assigneeId]]),
    R.fromPairs
  )(issuesIds);

export const getAssigneePointsBySprint = (issuesById, issuesIds) =>
  R.pipe(
    R.map(issueId => issuesById[issueId]),
    R.filter(Boolean),
    R.filter(issue => {
      const { assigneeId, points = 0, statusCategory } = issue;
      return assigneeId && points && statusCategory;
    }),
    R.reduce((prev, issue) => {
      const { assigneeId, points = 0, statusCategory } = issue;
      const oldAssigneePoints = prev[assigneeId];
      const newAssigneePoints = addPointsByCategory(
        oldAssigneePoints,
        statusCategory,
        points
      );
      return {
        ...prev,
        [assigneeId]: newAssigneePoints,
      };
    }, {})
  )(issuesIds);

export const getSprints = (issues, sprints, statusCategoryMap) => {
  const assignees = getAssigneesFromIssues(issues);
  const issuesById = getIssuesById(issues, statusCategoryMap);

  return R.map(sprint => {
    const { id, issuesIds, name } = sprint;
    return {
      id,
      name,
      assignees: getAssigneesBySprint(assignees, issuesById, issuesIds),
      pointsByAssignee: getAssigneePointsBySprint(issuesById, issuesIds),
    };
  })(sprints);
};

const processResponses = responses => {
  const issues = getArrayFromPath([0, 'body', 'issues'])(responses);
  const sprints = getArrayFromPath([0, 'body', 'sprints'])(responses);

  const mappedColumns = getArrayFromPath([
    1,
    'body',
    'rapidListConfig',
    'mappedColumns',
  ])(responses);
  const statusCategoryMap = getStatusCategoryMap(mappedColumns);

  if (!sprints.length) return null;

  return getSprints(issues, sprints, statusCategoryMap);
};

const fetchData = (callback = () => {}) => () => {
  const { location = {} } = window;
  const accountId = getAccountId(location.host || location.hostname);
  const rapidViewId = getRapidViewId(location.search);

  const urls = [
    `https://${accountId}.atlassian.net/rest/greenhopper/1.0/xboard/plan/backlog/data.json?rapidViewId=${rapidViewId}`,
    `https://${accountId}.atlassian.net/rest/greenhopper/1.0/rapidviewconfig/editmodel.json?rapidViewId=${rapidViewId}`,
  ];

  return Promise.all(urls.map(url => request.get(url).withCredentials())).then(
    responses => {
      const sprints = processResponses(responses);

      if (sprints) {
        callback(new Date(), sprints);
      }
    }
  );
};

export default fetchData;
