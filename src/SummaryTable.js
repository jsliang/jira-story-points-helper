import PureComponent from 'react-pure-render/component';
import React from 'react';
import { Map } from 'immutable';

const STATUS_NEW = 'new';
const STATUS_INDETERMINATE = 'indeterminate';
const STATUS_DONE = 'done';

const bgColor = {
  [STATUS_NEW]: '#ECEFF1',
  [STATUS_INDETERMINATE]: '#FFF176',
  [STATUS_DONE]: '#81C784',
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

                const totalPoints = (points.get(STATUS_NEW) || 0)
                  + (points.get(STATUS_INDETERMINATE) || 0)
                  + (points.get(STATUS_DONE) || 0);

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

                  const [major, minor] = pnt.toFixed(2).split('.');
                  const pntStr = (+minor === 0)
                    ? major
                    : `${major}.${minor.replace(/0+$/, '')}`;

                  return (
                    <div
                      style={partStyle}
                      title={`${statusKey}: ${pnt} points (${percentage}%)`}
                    >
                      {pntStr}
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
                          {genStatusPart(STATUS_NEW)}
                          {genStatusPart(STATUS_INDETERMINATE)}
                          {genStatusPart(STATUS_DONE)}
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
