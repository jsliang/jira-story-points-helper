import PureComponent from 'react-pure-render/component';
import React from 'react';
import styled from 'styled-components';

import {
  STATUS_NEW,
  STATUS_BG_COLOR,
  STATUS_BORDER_RADIUS,
  STATUS_FONT_COLOR,
  STATUS_TEXT,
} from './constants';
import { formatNumber } from './util';

class PointsBarCell extends PureComponent {
  static defaultProps = {
    percentage: 0,
    points: 0,
    status: STATUS_NEW,
  };

  render() {
    const { className, points, percentage, status } = this.props;

    const pntStr = formatNumber(points);

    return (
      <div
        className={className}
        title={`${STATUS_TEXT[status]}: ${pntStr} (${percentage}%)`}
      >
        {pntStr}
      </div>
    );
  }
}

export default styled(PointsBarCell)`
  align-items: center;
  background-color: ${({ status }) => STATUS_BG_COLOR[status]};
  border-radius: ${({ status }) => STATUS_BORDER_RADIUS[status]};
  box-sizing: border-box;
  color: ${({ status }) => STATUS_FONT_COLOR[status]};
  display: flex;
  flex: ${({ percentage }) => percentage};
  justify-content: center;
  line-height: 0.8125rem;
  padding: 4px 6px;
  transition: all 0.3s ease-in-out;
`;
