import _sortBy from 'lodash.sortby';
import _values from 'lodash.values';
import PureComponent from 'react-pure-render/component';
import React from 'react';

import { formatNumber, getTotalPoints, i18n } from './util';

import PointsBar from './PointsBar';

class SummaryTable extends PureComponent {
  render() {
    const { assignees, name, pointsByAssignee } = this.props.sprint;

    const totalStoryPoints = _values(assignees).reduce(
      (prev, assignee) => prev + getTotalPoints(pointsByAssignee[assignee.id]),
      0
    );

    if (totalStoryPoints === 0) {
      return <p><strong>{name}:</strong> {i18n('txtErrNoStoryPoints')}</p>;
    }

    const sortedAssignees = _sortBy(_values(assignees), assignee => assignee.name);

    return (
      <table style={{ borderCollapse: 'separate', width: '100%' }}>
        <thead>
          <tr>
            <td></td>
            <td colSpan={2} style={{ textAlign: 'right' }}><strong>{name}</strong></td>
          </tr>
          <tr>
            <td></td>
            <td style={{ color: '#707070', padding: '0 6px', textAlign: 'right', width: '50px' }}>
              {i18n('txtTotal')}
            </td>
            <td style={{ color: '#707070', textAlign: 'right', width: '170px' }}>
              {i18n('txtNew')}
              &nbsp;/&nbsp;
              {i18n('txtIndeterminate')}
              &nbsp;/&nbsp;
              {i18n('txtDone')}
            </td>
          </tr>
        </thead>
        <tbody>
          {
            sortedAssignees.map(assignee => {
              const assigneeId = assignee.id;
              const points = pointsByAssignee[assigneeId];

              const totalPoints = getTotalPoints(points);

              if (totalPoints > 0) {
                return (
                  <tr key={assigneeId}>
                    <td>
                      <img
                        alt={assignee.name}
                        className="ghx-avatar-img"
                        src={assignee.avatarUrl}
                      />
                      &nbsp;
                      <span>{assignee.name}</span>
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
          }
        </tbody>
      </table>
    );
  }
}

SummaryTable.defaultProps = {
  sprint: {},
};

export default SummaryTable;
