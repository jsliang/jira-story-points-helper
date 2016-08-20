import PureComponent from 'react-pure-render/component';
import React from 'react';

import ImgLogo from '../icon.png';

class IconReload extends PureComponent {
  render() {
    const { height, width } = this.props;
    return (
      <img src={ImgLogo} width={width} height={height} />
    );
  }
}

IconReload.defaultProps = {
  height: 20,
  width: 20,
};

export default IconReload;
