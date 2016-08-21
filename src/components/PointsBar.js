import PureComponent from 'react-pure-render/component';
import React from 'react';

import {
  ALL_STATUS,
  STATUS_BG_COLOR,
  STATUS_BORDER_RADIUS,
  STATUS_FONT_COLOR,
  STATUS_TEXT,
} from './constants';
import { formatNumber, getTotalPoints } from './util';

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
          const pnt = points[statusKey] || 0;
          const percentage = Math.round((pnt / totalPoints) * 100);
          const partStyle = {
            alignItems: 'center',
            backgroundColor: STATUS_BG_COLOR[statusKey],
            borderRadius: STATUS_BORDER_RADIUS[statusKey],
            boxSizing: 'border-box',
            color: STATUS_FONT_COLOR[statusKey],
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
              key={statusKey}
              style={partStyle}
              title={
                `${STATUS_TEXT[statusKey]}: ${pntStr}`
                + ` (${percentage}%)`
              }
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
  points: {},
};

export default PointsBar;
