export const formatNumber = n => {
  const [major, minor] = n.toFixed(2).split('.');

  return !minor || +minor === 0
    ? major
    : `${major}.${minor.replace(/0+$/, '')}`;
};

export const i18n = msgKey => chrome.i18n.getMessage(msgKey);
