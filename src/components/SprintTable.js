import _sortBy from 'lodash.sortby';
import _values from 'lodash.values';
import PureComponent from 'react-pure-render/component';
import React from 'react';
import styled from 'styled-components';

import { getTotalPoints, i18n } from './util';

import AssigneeRow from './AssigneeRow';
import SprintToggle from './SprintToggle';

class SprintTable extends PureComponent {
  static defaultProps = {
    expanded: false,
    sprint: {},
  };

  render() {
    const {
      className,
      expanded,
      sprint: { assignees, name, pointsByAssignee },
      toggle,
    } = this.props;

    const totalStoryPoints = _values(assignees).reduce(
      (prev, assignee) => prev + getTotalPoints(pointsByAssignee[assignee.id]),
      0
    );

    if (totalStoryPoints === 0) {
      return (
        <p>
          <strong>{name}:</strong> {i18n('txtErrNoStoryPoints')}
        </p>
      );
    }

    const sortedAssignees = _sortBy(
      _values(assignees),
      assignee => assignee.name
    );

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

              const totalPoints = getTotalPoints(points);

              if (totalPoints <= 0) return null;

              return (
                <AssigneeRow
                  avatarUrl={assignee.avatarUrl}
                  key={assigneeId}
                  name={assignee.name}
                  points={points}
                  totalPoints={totalPoints}
                />
              );
            })}
          </tbody>
        ) : null}
      </table>
    );
  }
}

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
