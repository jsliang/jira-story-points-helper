import PureComponent from 'react-pure-render/component';
import React from 'react';

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
    const { hover } = this.state;

    return (
      <div
        onClick={this.props.onClick}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseOut}
        style={{
          alignItems: 'center',
          backgroundColor: hover ? '#3b7fc4' : '#205081',
          borderRadius: '0 5px 0 20px',
          color: '#fff',
          cursor: 'pointer',
          display: 'flex',
          float: 'right',
          fontSize: '16px',
          fontWeight: 'bold',
          height: '30px',
          justifyContent: 'center',
          position: 'absolute',
          right: 0,
          top: 0,
          transition: 'background-color 0.3s ease-in-out',
          width: '30px',
        }}
        title="Reload data"
      >
        J
      </div>
    );
  }
}

ReloadButton.defaultProps = {
  onClick: () => {},
};

export default ReloadButton;
