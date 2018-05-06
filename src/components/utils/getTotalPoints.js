import { ALL_STATUS } from '../constants';

const getTotalPoints = (points = {}) =>
  ALL_STATUS.map(status => points[status] || 0).reduce(
    (sum, points) => sum + points,
    0
  );

export default getTotalPoints;
