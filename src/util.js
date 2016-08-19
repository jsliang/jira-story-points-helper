const STATUS_NEW = 'new';
const STATUS_INDETERMINATE = 'indeterminate';
const STATUS_DONE = 'done';

export const STATUS_BG_COLOR = {
  [STATUS_NEW]: '#ECEFF1',
  [STATUS_INDETERMINATE]: '#FFF176',
  [STATUS_DONE]: '#81C784',
};

export const ALL_STATUS = [
  STATUS_NEW,
  STATUS_INDETERMINATE,
  STATUS_DONE,
];

export const formatNumber = n => {
  const [major, minor] = n.toFixed(2).split('.');
  return (+minor === 0)
    ? major
    : `${major}.${minor.replace(/0+$/, '')}`;
}

export const getTotalPoints = points => ALL_STATUS.reduce(
  (reduction, statusKey) => reduction + (points.get(statusKey) || 0),
  0
);
