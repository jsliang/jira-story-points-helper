import * as R from 'ramda';
import { ALL_STATUS } from '../constants';

const getTotalPoints = (points = {}) =>
  R.pipe(
    R.map(status => R.prop(status, points)),
    R.map(R.defaultTo(0)),
    R.sum
  )(ALL_STATUS);

export default getTotalPoints;
