import * as R from 'ramda';
import React from 'react';
import styled from 'styled-components';

import getTotalPoints from './utils/getTotalPoints';
import i18n from './utils/i18n';

import AssigneeRow from './AssigneeRow';
import SprintToggle from './SprintToggle';

const getObjectValues = R.pipe(R.toPairs, R.map(([key, value]) => value));
const sortObjectsByName = R.sortBy(R.prop('name'));

const SprintTable = ({
  className,
  expanded = false,
  sprint: { assignees: assigneeMap = [], name = '', pointsByAssignee = {} },
  toggle = () => {},
}) => {
  const assignees = getObjectValues(assigneeMap);

  const totalStoryPoints = R.pipe(
    R.map(assignee => getTotalPoints(pointsByAssignee[assignee.id])),
    R.sum
  )(assignees);

  if (totalStoryPoints === 0)
    return (
      <p>
        <strong>{name}:</strong> {i18n('txtErrNoStoryPoints')}
      </p>
    );

  const sortedAssignees = sortObjectsByName(assignees);

  return (
    <table className={className}>
      <thead>
        <tr>
          <td />
          <td className="sprint-toggle" colSpan={2} onClick={toggle}>
            <SprintToggle expanded={expanded} name={name} />
          </td>
        </tr>
        {expanded ? (
          <tr>
            <td />
            <td className="thead-total">{i18n('txtTotal')}</td>
            <td className="thead-status">
              {i18n('txtNew')}
              &nbsp;/&nbsp;
              {i18n('txtIndeterminate')}
              &nbsp;/&nbsp;
              {i18n('txtDone')}
            </td>
          </tr>
        ) : null}
      </thead>
      {expanded ? (
        <tbody>
          {sortedAssignees.map(assignee => {
            const assigneeId = assignee.id;
            const points = pointsByAssignee[assigneeId];

            return (
              <AssigneeRow
                avatarUrl={assignee.avatarUrl}
                key={assigneeId}
                name={assignee.name}
                points={points}
              />
            );
          })}
        </tbody>
      ) : null}
    </table>
  );
};

export default styled(SprintTable)`
  border-collapse: separate;
  width: 100%;

  .sprint-toggle {
    text-align: right;
  }

  .thead-total {
    color: #707070;
    padding: 0 6px;
    text-align: right;
    width: 50px;
  }

  .thead-status {
    color: #707070;
    text-align: right;
    width: 170px;
  }
`;
