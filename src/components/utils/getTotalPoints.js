import { ALL_STATUS } from '../constants';

const getTotalPoints = (points = {}) =>
  ALL_STATUS.reduce(
    (reduction, statusKey) => reduction + (points[statusKey] || 0),
    0
  );

export default getTotalPoints;
