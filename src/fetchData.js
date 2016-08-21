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

const aggregateIssuesByAssignee = issues => {
  const assignees = issues.reduce((reduction, issue) => {
    const assigneeId = issue.assignee;
    if (!assigneeId) {
      return reduction;
    }

    if (_has(reduction, assigneeId)) {
      return reduction;
    }

    return {
      ...reduction,
      [assigneeId]: {
        id: assigneeId,
        name: issue.assigneeName,
        avatarUrl: issue.avatarUrl,
      },
    };
  }, {});

  const addPointsByCategory = (assigneePoints = {}, statusCategory, pointsToAdd) => {
    const oldValue = assigneePoints[statusCategory] || 0;

    return {
      ...assigneePoints,
      [statusCategory]: oldValue + pointsToAdd,
    };
  };

  const pointsByAssignee = issues.reduce((pointsSummary, issue) => {
    const assigneeId = issue.assignee;
    const statusCategory = _get(issue, 'status.statusCategory.key');
    const pointsToAdd = _get(issue, 'estimateStatistic.statFieldValue.value', 0);

    const oldAssigneePoints = pointsSummary[assigneeId];
    const newAssigneePoints = addPointsByCategory(oldAssigneePoints, statusCategory, pointsToAdd);

    return {
      ...pointsSummary,
      [assigneeId]: newAssigneePoints,
    };
  }, {});

  return { assignees, pointsByAssignee };
};

const reqUrlForAllData = () => {
  const accountId = getAccountId(window.location.host || window.location.hostname);
  const rapidViewId = getRapidViewId(window.location.search);

  return `https://${accountId}.atlassian.net/rest/greenhopper/1.0/xboard/work`
    + `/allData.json?rapidViewId=${rapidViewId}`;
};

const fetchData = (callback = () => {}) => () =>
  request
    .get(reqUrlForAllData())
    .withCredentials()
    .then(res => {
      const issues = _get(res, 'body.issuesData.issues');

      if (issues) {
        const { assignees, pointsByAssignee } = aggregateIssuesByAssignee(issues);
        callback(new Date(), assignees, pointsByAssignee);
      }
    });

export default fetchData;
