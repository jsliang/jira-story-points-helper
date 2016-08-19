export const STATUS_NEW = 'new';
export const STATUS_INDETERMINATE = 'indeterminate';
export const STATUS_DONE = 'done';

export const formatNumber = n => {
  const [major, minor] = n.toFixed(2).split('.');
  return (+minor === 0)
    ? major
    : `${major}.${minor.replace(/0+$/, '')}`;
}
