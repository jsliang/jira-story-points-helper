import PureComponent from 'react-pure-render/component';
import React from 'react';
import { Map } from 'immutable';

import { formatNumber, getTotalPoints } from './util';

import PointsBar from './PointsBar';

class SummaryTable extends PureComponent {
  render() {
    const { assignees, pointsByAssignee } = this.props;

    if (assignees.count() === 0) {
      return <p>No active sprint.</p>;
    }

    const totalStoryPoints = assignees.valueSeq().reduce(
      (reduction, assignee) =>
        reduction + getTotalPoints(pointsByAssignee.get(assignee.get('id'))),
      0
    );

    if (totalStoryPoints === 0) {
      return <p>No story points.</p>;
    }

    return (
      <table style={{ borderCollapse: 'separate' }}>
        <thead>
          <tr>
            <td></td>
            <td style={{ color: '#707070', padding: '0 6px' }}>Total</td>
            <td style={{ color: '#707070' }}>New / Indeterminate / Done</td>
          </tr>
        </thead>
        <tbody>
        {
          assignees
            .valueSeq()
            .sortBy(assignee => assignee.get('name'))
            .map(assignee => {
              const assigneeId = assignee.get('id');
              const points = pointsByAssignee.get(assigneeId);

              const totalPoints = getTotalPoints(points);

              if (totalPoints > 0) {
                return (
                  <tr key={assigneeId}>
                    <td>
                      <img
                        alt={assignee.get('name')}
                        className="ghx-avatar-img"
                        src={assignee.get('avatarUrl')}
                      />
                      &nbsp;
                      <span>{assignee.get('name')}</span>
                    </td>
                    <td style={{ padding: '0 6px' }}>
                      <div style={{
                        alignItems: 'center',
                        display: 'flex',
                        height: '100%',
                        justifyContent: 'flex-end',
                        width: '100%',
                      }}>
                        {formatNumber(totalPoints)}
                      </div>
                    </td>
                    <td>
                      <PointsBar points={points} />
                    </td>
                  </tr>
                );
              }

              return null;
            })
            .toJS()
        }
        </tbody>
      </table>
    );
  }
}

SummaryTable.defaultProps = {
  assignees: Map(),
  pointsByAssignee: Map(),
};

export default SummaryTable;
