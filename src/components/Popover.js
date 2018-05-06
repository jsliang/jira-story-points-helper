import _get from 'lodash.get';
import React, { PureComponent } from 'react';
import styled from 'styled-components';

import i18n from './utils/i18n';
import ReloadButton from './ReloadButton';
import SprintTable from './SprintTable';

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

const Panel = ({
  className,
  doFetchData = () => {},
  fetchTime = new Date(),
  hidePopover = () => {},
  show = false,
  showPopover = () => {},
  sprints = [],
  toggle = () => {},
  visibleSprints = newSet(),
}) => (
  <div
    className={className}
    onMouseEnter={showPopover}
    onMouseLeave={hidePopover}
  >
    <div className="container">
      <ReloadButton
        fetchTime={fetchTime}
        showReloadIcon={show}
        onClick={doFetchData}
      />
      <p className="last-updated-time">
        {i18n('txtLastUpdatedTime')}
        {formatDate(fetchTime)}
      </p>
      {sprints.map(sprint => (
        <SprintTable
          expanded={visibleSprints.has(sprint.id)}
          key={sprint.id}
          sprint={sprint}
          toggle={toggle(sprint.id)}
        />
      ))}
    </div>
  </div>
);

const StyledPanel = styled(Panel)`
  background-color: #fff;
  border-radius: 0 5px 0 0;
  bottom: 0;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.5);
  color: #333;
  font-size: 0.8125rem;
  left: 0;
  position: fixed;
  ${({ show }) => (show ? '' : 'transform: translate(-90%, 50%);')};
  transition: transform 0.5s ease-in-out;
  z-index: 300;

  .container {
    position: relative;
    padding: 20px;
  }

  .last-updated-time {
    color: #999;
    font-size: 0.75rem;
    padding-bottom: 1em;
  }
`;

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
    this.hideTimer = window.setTimeout(() => {
      this.setState({ show: false });
    }, 1000);
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
      <StyledPanel
        doFetchData={doFetchData}
        fetchTime={fetchTime}
        hidePopover={this.hidePopover}
        show={show}
        showPopover={this.showPopover}
        sprints={sprints}
        toggle={this.toggle}
        visibleSprints={visibleSprints}
      />
    );
  }
}
