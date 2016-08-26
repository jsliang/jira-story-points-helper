import PureComponent from 'react-pure-render/component';
import React from 'react';

import ReloadButton from './ReloadButton';
import SummaryTable from './SummaryTable';
import { i18n } from './util';

const padZero = num => `0${num}`.substr(-2, 2);

const formatDate = d => {
  const date = [
    d.getFullYear(),
    padZero(d.getMonth() + 1),
    padZero(d.getDate()),
  ].join('-');

  const time = [
    padZero(d.getHours()),
    padZero(d.getMinutes()),
    padZero(d.getSeconds()),
  ].join(':');

  return `${date} ${time}`;
};

class Popover extends PureComponent {
  constructor() {
    super();

    this.showPopover = this.showPopover.bind(this);
    this.hidePopover = this.hidePopover.bind(this);

    this.state = { show: false };
  }

  showPopover() {
    this.setState({ show: true });
  }
  hidePopover() {
    this.setState({ show: false });
  }

  render() {
    const {
      props: { doFetchData, fetchTime, sprints },
      state: { show },
    } = this;

    if (sprints.length === 0) {
      return <p>{i18n('txtErrNoSprint')}</p>;
    }

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
            {i18n('txtLastUpdatedTime')}
            {formatDate(fetchTime)}
          </p>
          {
            sprints.map((sprint, i) =>
              <SummaryTable
                key={sprint.id}
                collapsed={i > 0}
                sprint={sprint}
              />
            )
          }
        </div>
      </div>
    );
  }
}

Popover.defaultProps = {
  doFetchData: () => {},
  fetchTime: new Date(),
  sprints: {},
};

export default Popover;
