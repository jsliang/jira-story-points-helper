import PureComponent from 'react-pure-render/component';
import React from 'react';

export default class SprintToggle extends PureComponent {
  static defaultProps = {
    expanded: false,
    name: '',
  };

  constructor(props) {
    super(props);

    this.state = { hover: false };
  }

  onMouseEnter = () => {
    this.setState({ hover: true });
  };
  onMouseLeave = () => {
    this.setState({ hover: false });
  };

  render() {
    const {
      props: { expanded, name },
      state: { hover },
    } = this;

    return (
      <div
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        style={{
          color: expanded ? undefined : '#707070',
          cursor: 'pointer',
          fontWeight: 'bold',
          textDecoration: hover ? 'underline' : 'none',
        }}
      >
        {expanded ? '+' : '-'} {name}
      </div>
    );
  }
}
