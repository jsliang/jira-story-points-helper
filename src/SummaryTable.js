import PureComponent from 'react-pure-render/component';
import React from 'react';
import { Map } from 'immutable';

import ReloadButton from './ReloadButton';

const STATUS_NEW = 'new';
const STATUS_INDETERMINATE = 'indeterminate';
const STATUS_DONE = 'done';

const bgColor = {
  [STATUS_NEW]: '#ECEFF1',
  [STATUS_INDETERMINATE]: '#FFF176',
  [STATUS_DONE]: '#81C784',
};

const formatNumber = n => {
  const [major, minor] = n.toFixed(2).split('.');
  return (+minor === 0)
    ? major
    : `${major}.${minor.replace(/0+$/, '')}`;
}


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
      props: { assignees, doFetchData, pointsByAssignee },
      state: { show },
    } = this;

    return (
    <div
      onMouseEnter={this.showPopover}
      onMouseLeave={this.hidePopover}
      style={{
        backgroundColor: '#fff',
        borderRadius: '5px',
        bottom: 0,
        boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.5)',
        color: '#333',
        fontSize: '13px',
        left: 0,
        position: 'fixed',
        transform: show ? undefined : 'translate(-90%, 50%)',
        transition: 'transform 0.5s ease-in-out',
        zIndex: 100,
      }}
    >
      <div style={{
        position: 'relative',
        padding: '20px',
      }}>
        <ReloadButton
          showReloadIcon={show}
          onClick={doFetchData}
        />
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
                    justifyContent: 'center',
                    lineHeight: '13px',
                    padding: '4px 6px',
                    transition: 'all 0.3s ease-in-out',
                  };

                  const pntStr = formatNumber(pnt);

                  return (
                    <div
                      style={partStyle}
                      title={`${statusKey}: ${pntStr} points (${percentage}%)`}
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
                        <div style={{
                          alignItems: 'stretch',
                          boxSizing: 'border-box',
                          display: 'flex',
                          height: '100%',
                          width: '100%',
                        }}>
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
  doFetchData: () => {},
  pointsByAssignee: Map(),
};

export default SummaryTable;
