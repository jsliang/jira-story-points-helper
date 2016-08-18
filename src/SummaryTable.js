import PureComponent from 'react-pure-render/component';
import React from 'react';
import { Map } from 'immutable';

const bgColor = {
  new: '#ECEFF1',
  indeterminate: '#FFF176',
  done: '#81C784',
};

class SummaryTable extends PureComponent {
  render() {
    const { assignees, pointsByAssignee } = this.props;

    const popoverStyle = {
      backgroundColor: '#fff',
      bottom: 0,
      boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.5)',
      fontSize: '15px',
      left: '10px',
      position: 'fixed',
      zIndex: 100,
    };

    const barStyle = {
      alignItems: 'stretch',
      boxSizing: 'border-box',
      display: 'flex',
      height: '100%',
      width: '100%',
    };

    return (
      <div style={popoverStyle}>
        <table style={{ borderCollapse: 'separate', borderSpacing: '6px', margin: '5px' }}>
          <thead>
            <tr>
              <td></td>
              <td>new / indeterminate / done</td>
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

                const totalPoints = (points.get('new') || 0)
                  + (points.get('intermediate') || 0)
                  + (points.get('done') || 0);

                const genStatusPart = (statusKey) => {
                  const pnt = points.get(statusKey) || 0;
                  const percentage = Math.round(pnt / totalPoints * 100);
                  const partStyle = {
                    alignItems: 'center',
                    backgroundColor: bgColor[statusKey],
                    boxSizing: 'border-box',
                    color: '#555',
                    display: 'flex',
                    flex: percentage,
                    fontSize: '13px',
                    lineHeight: '13px',
                    justifyContent: 'center',
                    padding: '4px 6px',
                  };

                  return (
                    <div
                      style={partStyle}
                      title={`${statusKey}: ${pnt} points (${percentage}%)`}
                    >
                      {pnt}
                    </div>
                  );
                };

                if (totalPoints > 0) {
                  return (
                    <tr key={assigneeId}>
                      <td>
                        <img
                          alt={`Assignee: ${assignee.get('name')}`}
                          className="ghx-avatar-img"
                          src={assignee.get('avatarUrl')}
                        />
                        &nbsp;
                        <span style={{ fontSize: '13px' }}>{assignee.get('name')}</span>
                      </td>
                      <td>
                        <div style={barStyle}>
                          {genStatusPart('new')}
                          {genStatusPart('indeterminate')}
                          {genStatusPart('done')}
                        </div>
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
      </div>
    );
  }
}

SummaryTable.defaultProps = {
  assignees: Map(),
  pointsByAssignee: Map(),
};

export default SummaryTable;
