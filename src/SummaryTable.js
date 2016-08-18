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
  constructor() {
    super();

    this.showPopover = this.showPopover.bind(this);
    this.hidePopover = this.hidePopover.bind(this);

    this.state = {
      show: false,
    };
  }

  showPopover() {
    this.setState({
      show: true,
    });
  }
  hidePopover() {
    this.setState({
      show: false,
    });
  }

  render() {
    const {
      props: { assignees, pointsByAssignee },
      state: { show },
    } = this;

    const popoverStyle = {
      backgroundColor: '#fff',
      borderRadius: '5px',
      bottom: 0,
      boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.5)',
      fontSize: '15px',
      left: 0,
      position: 'fixed',
      transform: show ? undefined : 'translate(-90%, 50%)',
      transition: 'transform 0.5s ease-in-out',
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
    <div
      onMouseEnter={this.showPopover}
      onMouseLeave={this.hidePopover}
      style={popoverStyle}
    >
      <div style={{
        position: 'relative',
        padding: '15px',
      }}>
        <div style={{
          alignItems: 'center',
          backgroundColor: '#205081',
          borderRadius: '0 5px 0 20px',
          color: '#fff',
          display: 'flex',
          float: 'right',
          fontSize: '16px',
          fontWeight: 'bold',
          height: '30px',
          justifyContent: 'center',
          opacity: show ? 0 : 100,
          position: 'absolute',
          right: 0,
          top: 0,
          transition: 'opacity 0.5s ease-in-out',
          width: '30px',
        }}>J</div>
        <table style={{ borderCollapse: 'separate', borderSpacing: '6px' }}>
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
    </div>
    );
  }
}

SummaryTable.defaultProps = {
  assignees: Map(),
  pointsByAssignee: Map(),
};

export default SummaryTable;
