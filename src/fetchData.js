import * as R from 'ramda';
import request from 'superagent';

export const getAccountId = host => host.replace('.atlassian.net', '').trim();

export const getRapidViewId = url => {
  const re = /rapidView=(\d+)/;
  const m = re.exec(url);
  return m ? m[1] : null;
};

export const addPointsByCategory = (
  assigneePoints = {},
  statusCategory,
  pointsToAdd
) => {
  const oldValue = assigneePoints[statusCategory] || 0;

  return {
    ...assigneePoints,
    [statusCategory]: oldValue + pointsToAdd,
  };
};

export const getStatusCategoryMap = mappedColumns =>
  R.pipe(
    R.map(column => R.prop('mappedStatuses', column) || []),
    R.unnest,
    R.reduce((accu, status) => {
      const statusId = status.id;
      const statusCategory = R.path(['statusCategory', 'key'], status) || [];
      if (statusId && statusCategory) {
        return { ...accu, [statusId]: statusCategory };
      }
      return accu;
    }, {})
  )(mappedColumns);

export const getAssigneesFromIssues = issues =>
  issues.reduce((prev, issue) => {
    const assigneeId = issue.assignee;
    if (!assigneeId) return prev;

    if (R.has(assigneeId, prev)) return prev;

    return {
      ...prev,
      [assigneeId]: {
        id: assigneeId,
        name: issue.assigneeName,
        avatarUrl: issue.avatarUrl,
      },
    };
  }, {});

export const getIssuesById = (issues, statusCategoryMap) =>
  issues.reduce(
    (prev, issue) => ({
      ...prev,
      [issue.id]: {
        assigneeId: issue.assignee,
        points:
          R.path(['estimateStatistic', 'statFieldValue', 'value'], issue) || 0,
        statusCategory: statusCategoryMap[issue.statusId],
      },
    }),
    {}
  );

export const getAssigneesBySprint = (assignees, issuesById, issuesIds) =>
  R.pipe(
    R.map(issueId => issuesById[issueId]),
    R.filter(
      ({ assigneeId, points = 0, statusCategory }) =>
        assigneeId && points && statusCategory
    ),
    R.map(issue => issue.assigneeId),
    R.uniq,
    R.reduce(
      (accu, assigneeId) => ({ ...accu, [assigneeId]: assignees[assigneeId] }),
      {}
    )
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

  return sprints.map(sprint => {
    const { id, issuesIds, name } = sprint;
    return {
      id,
      name,
      assignees: getAssigneesBySprint(assignees, issuesById, issuesIds),
      pointsByAssignee: getAssigneePointsBySprint(issuesById, issuesIds),
    };
  });
};

const processResponses = responses => {
  const issues = R.path([0, 'body', 'issues'], responses) || [];
  const sprints = R.path([0, 'body', 'sprints'], responses) || [];
  const statusCategoryMap = getStatusCategoryMap(
    R.path([1, 'body', 'rapidListConfig', 'mappedColumns'], responses) || []
  );

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
