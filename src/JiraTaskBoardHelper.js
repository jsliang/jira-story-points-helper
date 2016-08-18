import React from 'react';
import request from 'superagent';
import { fromJS, Map } from 'immutable';
import { render } from 'react-dom';

import SummaryTable from './SummaryTable';

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
    const assigneeId = issue.get('assignee');
    if (!assigneeId) {
      return reduction;
    }

    if (reduction.has(assigneeId)) {
      return reduction;
    }

    return reduction.set(assigneeId, Map({
      id: assigneeId,
      name: issue.get('assigneeName'),
      avatarUrl: issue.get('avatarUrl'),
    }));
  }, Map());

  const pointsByAssignee = issues.reduce((reduction, issue) => {
    const assigneeId = issue.get('assignee');
    return reduction.update(assigneeId, (status = Map()) => {
      const statusCategory = issue.getIn(['status', 'statusCategory', 'key']);
      return status.update(statusCategory, (d = 0) =>
        d + (issue.getIn(['estimateStatistic', 'statFieldValue', 'value']) || 0)
      );
    });
  }, Map());

  return { assignees, pointsByAssignee };
};

class JiraTaskBoardHelper {
  constructor() {
    const setElementAttr = (el, attr, value) => {
      const att = document.createAttribute(attr);
      att.value = value;
      el.setAttributeNode(att);
    };

    const div = document.createElement("div");
    setElementAttr(div, 'id', 'jira-taskboard-helper');

    document.body.appendChild(div);
  }

  fetchData() {
    const rapidViewId = getRapidViewId(window.location.search);
    request
      .get(`https://appier.atlassian.net/rest/greenhopper/1.0/xboard/work/allData.json?rapidViewId=${rapidViewId}`)
      .withCredentials()
      .then(res => {
        this.issues = fromJS(res.body.issuesData.issues);

        const { assignees, pointsByAssignee } = aggregateIssuesByAssignee(this.issues);
        this.assignees = assignees;
        this.pointsByAssignee = pointsByAssignee;

        this.updateView();
      });
  }

  updateView() {
    render(
      <SummaryTable
        assignees={this.assignees}
        pointsByAssignee={this.pointsByAssignee}
      />,
      document.getElementById('jira-taskboard-helper')
    );
  }
}

export default JiraTaskBoardHelper;
