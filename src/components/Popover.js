import _get from 'lodash.get';
import PureComponent from 'react-pure-render/component';
import React from 'react';

import ReloadButton from './ReloadButton';
import SprintTable from './SprintTable';
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

export default class Popover extends PureComponent {
  static defaultProps = {
    doFetchData: () => {},
    fetchTime: new Date(),
    sprints: {},
  };

  constructor(props) {
    super(props);

    this.hideTimer = null;

    this.state = {
      show: false,
      visibleSprints: new Set([_get(props, 'sprints[0].id')]),
    };
  }

  showPopover = () => {
    window.clearTimeout(this.hideTimer);
    this.setState({ show: true });
  };
  hidePopover = () => {
    window.clearTimeout(this.hideTimer);
    this.hideTimer = window.setTimeout(
      () => {
        this.setState({ show: false });
      },
      1000,
    );
  };

  toggle = sprintId => () => {
    const { visibleSprints } = this.state;

    const newVisibleSprints = new Set(visibleSprints);
    if (visibleSprints.has(sprintId)) {
      newVisibleSprints.delete(sprintId);
    } else {
      newVisibleSprints.add(sprintId);
    }

    if (newVisibleSprints.size > 0) {
      this.setState({
        visibleSprints: newVisibleSprints,
      });
    }
  };

  render() {
    const {
      props: { doFetchData, fetchTime, sprints },
      state: { show, visibleSprints },
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
          zIndex: 300,
        }}
      >
        <div
          style={{
            position: 'relative',
            padding: '20px',
          }}
        >
          <ReloadButton
            fetchTime={fetchTime}
            showReloadIcon={show}
            onClick={doFetchData}
          />
          <p
            style={{ color: '#999', fontSize: '0.75rem', paddingBottom: '1em' }}
          >
            {i18n('txtLastUpdatedTime')}
            {formatDate(fetchTime)}
          </p>
          {sprints.map(sprint => (
            <SprintTable
              expanded={visibleSprints.has(sprint.id)}
              key={sprint.id}
              sprint={sprint}
              toggle={this.toggle(sprint.id)}
            />
          ))}
        </div>
      </div>
    );
  }
}
