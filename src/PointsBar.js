import PureComponent from 'react-pure-render/component';
import React from 'react';
import { Map } from 'immutable';

import ReloadButton from './ReloadButton';
import {
  formatNumber,
  STATUS_NEW,
  STATUS_INDETERMINATE,
  STATUS_DONE,
} from './util';

const bgColor = {
  [STATUS_NEW]: '#ECEFF1',
  [STATUS_INDETERMINATE]: '#FFF176',
  [STATUS_DONE]: '#81C784',
};

class PointsBar extends PureComponent {
  render() {
    const { points } = this.props;

    const totalPoints = (points.get(STATUS_NEW) || 0)
      + (points.get(STATUS_INDETERMINATE) || 0)
      + (points.get(STATUS_DONE) || 0);

    return (
      <div style={{
        alignItems: 'stretch',
        boxSizing: 'border-box',
        display: 'flex',
        height: '100%',
        width: '100%',
      }}>
      {
        [STATUS_NEW, STATUS_INDETERMINATE, STATUS_DONE].map((statusKey) => {
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
