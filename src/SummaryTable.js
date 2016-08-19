import moment from 'moment';
import PureComponent from 'react-pure-render/component';
import React from 'react';
import { Map } from 'immutable';

import { ALL_STATUS } from './constants';
import { formatNumber, getTotalPoints } from './util';

import ReloadButton from './ReloadButton';
import PointsBar from './PointsBar';

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
      props: { assignees, doFetchData, fetchTime, pointsByAssignee },
      state: { show },
    } = this;

    return (
    <div
      onMouseEnter={this.showPopover}
      onMouseLeave={this.hidePopover}
      style={{
        backgroundColor: '#fff',
        borderRadius: '0 5px 0 0',
        bottom: 0,
        boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.5)',
        color: '#333',
        fontSize: '0.8125rem',
        left: 0,
        position: 'fixed',
        transform: show ? undefined : 'translate(-90%, 50%)',
        transition: 'transform 0.5s ease-in-out',
        zIndex: 100,
      }}
    >
      <div style={{
        position: 'relative',
        padding: '10px 20px',
      }}>
        <ReloadButton
          fetchTime={fetchTime}
          showReloadIcon={show}
          onClick={doFetchData}
        />
        <p style={{ color: '#999', fontSize: '0.75rem' }}>
          Last updated time: {moment(fetchTime).format('YYYY/MM/DD HH:mm:ss')}
        </p>
        {assignees.count() === 0
          ? <p>No active sprint.</p>
          : (
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
        )}
      </div>
    </div>
    );
  }
}

SummaryTable.defaultProps = {
  assignees: Map(),
  doFetchData: () => {},
  fetchTime: new Date(),
  pointsByAssignee: Map(),
};

export default SummaryTable;
