import React, { PureComponent } from 'react';

import ImgLogo from '../icon.png';

export default class IconReload extends PureComponent {
  static defaultProps = {
    height: 20,
    width: 20,
  };

  render() {
    const { height, width } = this.props;
    return <img src={ImgLogo} width={width} height={height} />;
  }
}
