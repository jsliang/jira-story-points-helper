import PureComponent from 'react-pure-render/component';
import React from 'react';
import { Map } from 'immutable';

import ReloadButton from './ReloadButton';
import {
  ALL_STATUS,
  formatNumber,
  getTotalPoints,
  STATUS_BG_COLOR,
} from './util';

class PointsBar extends PureComponent {
  render() {
    const { points } = this.props;

    const totalPoints = getTotalPoints(points);

    return (
      <div style={{
        alignItems: 'stretch',
        boxSizing: 'border-box',
        display: 'flex',
        height: '100%',
        width: '100%',
      }}>
      {
        ALL_STATUS.map((statusKey) => {
          const pnt = points.get(statusKey) || 0;
          const percentage = Math.round(pnt / totalPoints * 100);
          const partStyle = {
            alignItems: 'center',
            backgroundColor: STATUS_BG_COLOR[statusKey],
            boxSizing: 'border-box',
            color: '#555',
            display: 'flex',
            flex: percentage,
            justifyContent: 'center',
            lineHeight: '0.8125rem',
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
        })
      }
      </div>
    );
  }
}

PointsBar.defaultProps = {
  points: Map(),
};

export default PointsBar;
