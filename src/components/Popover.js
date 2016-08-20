import moment from 'moment';
import PureComponent from 'react-pure-render/component';
import React from 'react';
import { Map } from 'immutable';

import ReloadButton from './ReloadButton';
import SummaryTable from './SummaryTable';

class Popover extends PureComponent {
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
        padding: '20px',
      }}>
        <ReloadButton
          fetchTime={fetchTime}
          showReloadIcon={show}
          onClick={doFetchData}
        />
        <p style={{ color: '#999', fontSize: '0.75rem', paddingBottom: '1em' }}>
          {chrome.i18n.getMessage('txtLastUpdatedTime')}
          {moment(fetchTime).format('YYYY/MM/DD HH:mm:ss')}
        </p>
        <SummaryTable
          assignees={assignees}
          pointsByAssignee={pointsByAssignee}
        />
      </div>
    </div>
    );
  }
}

Popover.defaultProps = {
  assignees: Map(),
  doFetchData: () => {},
  fetchTime: new Date(),
  pointsByAssignee: Map(),
};

export default Popover;
