import PureComponent from 'react-pure-render/component';
import React from 'react';

import IconReload from '../icons/IconReload';

class ReloadButton extends PureComponent {
  constructor() {
    super();

    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseOut = this.onMouseOut.bind(this);

    this.state = {
      hover: false,
    };
  }

  onMouseEnter() {
    this.setState({
      hover: true,
    });
  }
  onMouseOut() {
    this.setState({
      hover: false,
    });
  }

  render() {
    const {
      props: { showReloadIcon },
      state: { hover },
    } = this;

    const bgColor = showReloadIcon ? '#296ca3' : '#205081';

    return (
      <div
        onClick={this.props.onClick}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseOut}
        style={{
          alignItems: 'center',
          backgroundColor: (showReloadIcon && hover) ? '#3b7fc4' : bgColor,
          borderRadius: '0 5px 0 20px',
          color: '#fff',
          cursor: showReloadIcon ? 'pointer' : 'default',
          display: 'flex',
          float: 'right',
          fontSize: '1rem',
          fontWeight: 'bold',
          height: '30px',
          justifyContent: 'center',
          lineHeight: '1rem',
          position: 'absolute',
          right: 0,
          top: 0,
          transition: 'background-color 0.3s ease-in-out',
          width: '30px',
        }}
        title={chrome.i18n.getMessage('txtReloadData')}
      >
        { showReloadIcon ? <IconReload color='#ffffff' /> : 'J' }
      </div>
    );
  }
}

ReloadButton.defaultProps = {
  onClick: () => {},
  showReloadIcon: false,
};

export default ReloadButton;
