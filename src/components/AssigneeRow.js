import React, { PureComponent } from 'react';
import styled from 'styled-components';

import { formatNumber } from './util';

import PointsBar from './PointsBar';

class AssigneeRow extends PureComponent {
  static defaultProps = {
    avatarUrl: '',
    name: '',
    points: 0,
    totalPoints: 0,
  };

  render() {
    const { avatarUrl, className, name, points, totalPoints } = this.props;

    return (
      <tr className={className}>
        <td>
          <img alt={name} className="ghx-avatar-img" src={avatarUrl} />
          &nbsp;
          <span>{name}</span>
        </td>
        <td className="total">
          <div className="total-points">{formatNumber(totalPoints)}</div>
        </td>
        <td>
          <PointsBar points={points} />
        </td>
      </tr>
    );
  }
}

export default styled(AssigneeRow)`
  .total {
    padding: 0 6px;
  }

  .total-points {
    align-items: center;
    display: flex;
    height: 100%;
    justify-content: flex-end;
    width: 100%;
  }
`;
