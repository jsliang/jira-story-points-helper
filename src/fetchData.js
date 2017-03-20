import _get from 'lodash.get';
import _has from 'lodash.has';
import request from 'superagent';

const getAccountId = host => host.replace('.atlassian.net', '').trim();

const getRapidViewId = url => {
  const re = /rapidView=(\d+)/;
  const m = re.exec(url);
  if (m) {
    return m[1];
  }
  return null;
};

const addPointsByCategory = (
  assigneePoints = {},
  statusCategory,
  pointsToAdd,
) => {
  const oldValue = assigneePoints[statusCategory] || 0;

  return {
    ...assigneePoints,
    [statusCategory]: oldValue + pointsToAdd,
  };
};

const reqUrlForAllData = () => {
  const accountId = getAccountId(
    window.location.host || window.location.hostname,
  );
  const rapidViewId = getRapidViewId(window.location.search);

  return `https://${accountId}.atlassian.net/rest/greenhopper/1.0/xboard/plan/backlog` +
    `/data.json?rapidViewId=${rapidViewId}`;
};

const fetchAllDataPromise = request.get(reqUrlForAllData()).withCredentials();

const reqUrlForEditModel = () => {
  const accountId = getAccountId(
    window.location.host || window.location.hostname,
  );
  const rapidViewId = getRapidViewId(window.location.search);

  return `https://${accountId}.atlassian.net/rest/greenhopper/1.0/rapidviewconfig/` +
    `editmodel.json?rapidViewId=${rapidViewId}`;
};

const fetchEditModelPromise = request
  .get(reqUrlForEditModel())
  .withCredentials();

const getStatusCategoryMap = editModelResponse => {
  const mappedColumns = _get(
    editModelResponse,
    'rapidListConfig.mappedColumns',
    [],
  );

  const map = {};
  mappedColumns.forEach(column => {
    const mappedStatuses = _get(column, 'mappedStatuses', []);
    mappedStatuses.forEach(status => {
      const statusId = status.id;
      const statusCategory = _get(status, 'statusCategory.key', '');
      if (statusId && statusCategory) {
        map[statusId] = statusCategory;
      }
    });
  });

  return map;
};

const fetchData = (callback = () => {}) => () => Promise.all([
  fetchAllDataPromise,
  fetchEditModelPromise,
]).then(responses => {
  const issues = _get(responses, '[0].body.issues', []);
  const sprints = _get(responses, '[0].body.sprints', []);
  const statusCategoryMap = getStatusCategoryMap(
    _get(responses, '[1].body', []),
  );

  if (sprints.length) {
    const assignees = issues.reduce(
      (prev, issue) => {
        const assigneeId = issue.assignee;
        if (!assigneeId) {
          return prev;
        }

        if (_has(prev, assigneeId)) {
          return prev;
        }

        return {
          ...prev,
          [assigneeId]: {
            id: assigneeId,
            name: issue.assigneeName,
            avatarUrl: issue.avatarUrl,
          },
        };
      },
      {},
    );

    const issuesById = issues.reduce(
      (prev, issue) => ({
        ...prev,
        [issue.id]: {
          assigneeId: issue.assignee,
          points: _get(issue, 'estimateStatistic.statFieldValue.value', 0),
          statusCategory: statusCategoryMap[issue.statusId],
        },
      }),
      {},
    );

    const assigneesBySprint = issuesIds => issuesIds.reduce(
      (prev, issueId) => {
        const { assigneeId, points = 0, statusCategory } = issuesById[issueId];
        if (!assigneeId || !points || !statusCategory) return prev;

        return {
          ...prev,
          [assigneeId]: assignees[assigneeId],
        };
      },
      {},
    );

    const assigneePointsBySprint = issuesIds => issuesIds.reduce(
      (prev, issueId) => {
        const issue = issuesById[issueId];
        if (!issue) return prev;

        const { assigneeId, points = 0, statusCategory } = issue;
        if (!points || !assigneeId || !statusCategory) return prev;

        const oldAssigneePoints = prev[assigneeId];
        const newAssigneePoints = addPointsByCategory(
          oldAssigneePoints,
          statusCategory,
          points,
        );

        return {
          ...prev,
          [issue.assigneeId]: newAssigneePoints,
        };
      },
      {},
    );

    callback(
      new Date(),
      sprints.map(sprint => {
        const { id, issuesIds, name } = sprint;
        return {
          id,
          name,
          assignees: assigneesBySprint(issuesIds),
          pointsByAssignee: assigneePointsBySprint(issuesIds),
        };
      }),
    );
  }
});

export default fetchData;
