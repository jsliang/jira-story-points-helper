import $ from 'jquery';
import React from 'react';
import request from 'superagent';
import { fromJS, Map } from 'immutable';
import { render } from 'react-dom';

import SummaryTable from './SummaryTable';

const aggregateIssuesByAssignee = issues => {
  const assignees = issues.reduce((reduction, issue) => {
    const assigneeId = issue.get('assignee');
    if (reduction.has(assigneeId)) {
      return reduction;
    }

    return reduction.set(assigneeId, Map({
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
  }

  initPopover() {
    const popoverStyle = [
      'align-items: stretch;',
      'background-color: #fff;',
      'bottom: 10px;',
      'box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.5);',
      'display: flex;',
      'font-size: 15px;',
      'left: 0;',
      'position: fixed;',
      'z-index: 100;',
    ];
    $('body').append(`
      <div id='jira-taskboard-helper' style='${popoverStyle.join(' ')}'></div>
    `);
  }

  fetchAllData(rapidViewId) {
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
    console.log(this.assignees.toJS());
    console.log(this.pointsByAssignee.toJS());
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
