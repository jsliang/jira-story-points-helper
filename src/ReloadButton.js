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
        { showReloadIcon ? (
          <svg width="14" height="14" viewBox="0 0 16 16">
            <path
              d="M13.901 2.599A8 8 0 0 0 0 8h1.5a6.5 6.5 0 0 1 11.339-4.339L10.5 6H16V.5l-2.099 2.099zM14.5 8a6.5 6.5 0 0 1-11.339 4.339L5.5 10H0v5.5l2.099-2.099A8 8 0 0 0 16 8h-1.5z"
              fill="#ffffff"
            />
          </svg>
        ) : 'J' }
      </div>
    );
  }
}

ReloadButton.defaultProps = {
  onClick: () => {},
  showReloadIcon: false,
};

export default ReloadButton;
