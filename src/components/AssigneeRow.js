import React from 'react';
import styled from 'styled-components';

import { STATUS_NEW, STATUS_INDETERMINATE, STATUS_DONE } from './constants';
import formatNumber from './utils/formatNumber';
import getTotalPoints from './utils/getTotalPoints';
import PointsBar from './PointsBar';

const AssigneeRow = ({
  avatarUrl = '',
  className,
  name = '',
  points = { [STATUS_NEW]: 0, [STATUS_INDETERMINATE]: 0, [STATUS_DONE]: 0 },
}) => {
  const totalPoints = getTotalPoints(points);

  if (!totalPoints) return null;

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
};

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
