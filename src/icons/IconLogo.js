import React from 'react';

import ImgLogo from '../icon.png';

export default ({ width = 20, height = 20 }) => (
  <img src={ImgLogo} width={width} height={height} />
);
