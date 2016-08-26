import _get from 'lodash.get';
import _has from 'lodash.has';
import request from 'superagent';

const getAccountId = host =>
  host.replace('.atlassian.net', '').trim();

const getRapidViewId = url => {
  const re = /rapidView=(\d+)/;
  const m = re.exec(url);
  if (m) {
    return m[1];
  }
  return null;
};

const addPointsByCategory = (assigneePoints = {}, statusCategory, pointsToAdd) => {
  const oldValue = assigneePoints[statusCategory] || 0;

  return {
    ...assigneePoints,
    [statusCategory]: oldValue + pointsToAdd,
  };
};

const reqUrlForAllData = () => {
  const accountId = getAccountId(window.location.host || window.location.hostname);
  const rapidViewId = getRapidViewId(window.location.search);

  return `https://${accountId}.atlassian.net/rest/greenhopper/1.0/xboard/plan/backlog`
    + `/data.json?rapidViewId=${rapidViewId}`;
};

const fetchData = (callback = () => {}) => () =>
  request
    .get(reqUrlForAllData())
    .withCredentials()
    .then(res => {
      const issues = _get(res, 'body.issues', []);
      const sprints = _get(res, 'body.sprints', []);

      if (sprints.length) {
        const assignees = issues.reduce((prev, issue) => {
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
        }, {});

        const issuesById = issues.reduce((prev, issue) => ({
          ...prev,
          [issue.id]: {
            assigneeId: issue.assignee,
            points: _get(issue, 'estimateStatistic.statFieldValue.value', 0),
            statusCategory: _get(issue, 'status.statusCategory.key'),
          },
        }), {});

        const assigneesBySprint = issuesIds => issuesIds.reduce((prev, issueId) => {
          const { assigneeId, points = 0, statusCategory } = issuesById[issueId];
          if (!assigneeId || !points || !statusCategory) return prev;

          return {
            ...prev,
            [assigneeId]: assignees[assigneeId],
          };
        }, {});

        const assigneePointsBySprint = issuesIds => issuesIds.reduce((prev, issueId) => {
          const issue = issuesById[issueId];
          if (!issue) return prev;

          const { assigneeId, points = 0, statusCategory } = issue;
          if (!points || !assigneeId || !statusCategory) return prev;

          const oldAssigneePoints = prev[assigneeId];
          const newAssigneePoints = addPointsByCategory(
            oldAssigneePoints,
            statusCategory,
            points
          );

          return {
            ...prev,
            [issue.assigneeId]: newAssigneePoints,
          };
        }, {});

        callback(new Date(), sprints.map(sprint => {
          const { id, issuesIds, name } = sprint;
          return {
            id,
            name,
            assignees: assigneesBySprint(issuesIds),
            pointsByAssignee: assigneePointsBySprint(issuesIds),
          };
        }));
      }
    });

export default fetchData;
