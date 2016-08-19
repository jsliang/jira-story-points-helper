const STATUS_NEW = 'new';
const STATUS_INDETERMINATE = 'indeterminate';
const STATUS_DONE = 'done';

export const STATUS_BG_COLOR = {
  [STATUS_NEW]: '#4a6785',
  [STATUS_INDETERMINATE]: '#f6c342',
  [STATUS_DONE]: '#14892c',
};

export const STATUS_FONT_COLOR = {
  [STATUS_NEW]: '#fff',
  [STATUS_INDETERMINATE]: '#000',
  [STATUS_DONE]: '#fff',
};

export const STATUS_BORDER_RADIUS = {
  [STATUS_NEW]: '4px 0 0 4px',
  [STATUS_INDETERMINATE]: undefined,
  [STATUS_DONE]: '0 4px 4px 0',
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
