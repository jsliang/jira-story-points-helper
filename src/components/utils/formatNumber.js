const formatNumber = n => {
  const [major, minor] = n.toFixed(2).split('.');

  return !minor || +minor === 0
    ? major
    : `${major}.${minor.replace(/0+$/, '')}`;
};

export default formatNumber;
