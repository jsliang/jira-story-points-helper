import React, { PureComponent } from 'react';
import styled from 'styled-components';

import PointsBarCell from './PointsBarCell';

import { ALL_STATUS } from './constants';
import { getTotalPoints } from './util';

class PointsBar extends PureComponent {
  static defaultProps = {
    points: {},
  };

  render() {
    const { className, points } = this.props;

    const totalPoints = getTotalPoints(points);

    return (
      <div className={className}>
        {ALL_STATUS.map(status => {
          const pnt = points[status] || 0;
          const percentage = Math.round(pnt / totalPoints * 100);

          return (
            <PointsBarCell
              key={status}
              percentage={percentage}
              points={pnt}
              status={status}
            />
          );
        })}
      </div>
    );
  }
}

export default styled(PointsBar)`
  align-items: stretch;
  box-sizing: border-box;
  display: flex;
  height: 100%;
  width: 100%;
`;
