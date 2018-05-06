import PureComponent from 'react-pure-render/component';
import React from 'react';
import styled from 'styled-components';

class ToggleButton extends PureComponent {
  static defaultProps = {
    expanded: false,
    hover: false,
    name: '',
    onMouseEnter: () => {},
    onMouseLeave: () => {},
  };

  render() {
    const {
      className,
      expanded,
      hover,
      name,
      onMouseEnter,
      onMouseLeave,
    } = this.props;

    return (
      <div
        className={className}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {expanded ? '+' : '-'} {name}
      </div>
    );
  }
}

const StyledToggleButton = styled(ToggleButton)`
  ${({ expanded }) => (expanded ? '' : 'color: #707070')};
  cursor: pointer;
  font-weight: bold;
  text-decoration: ${({ hover }) => (hover ? 'underline' : 'none')};
`;

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
      <StyledToggleButton
        expanded={expanded}
        hover={hover}
        name={name}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
      />
    );
  }
}
