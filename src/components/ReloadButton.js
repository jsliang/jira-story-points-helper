import React, { PureComponent } from 'react';
import styled from 'styled-components';

import i18n from './utils/i18n';
import IconLogo from '../icons/IconLogo';
import IconReload from '../icons/IconReload';

const Button = ({
  children,
  className,
  hover = false,
  onClick = () => {},
  onMouseEnter = () => {},
  onMouseOut = () => {},
  showReloadIcon = false,
}) => (
  <div
    className={className}
    onClick={onClick}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseOut}
    title={i18n('txtReloadData')}
  >
    {children}
  </div>
);

const StyledButton = styled(Button)`
  align-items: center;
  background-color: ${({ showReloadIcon, hover }) =>
    showReloadIcon && hover ? '#3b7fc4' : '#fff'};
  border-radius: 0 5px 0 20px;
  color: #fff;
  cursor: ${({ showReloadIcon }) => (showReloadIcon ? 'pointer' : 'default')};
  display: flex;
  float: right;
  font-size: 1rem;
  font-weight: bold;
  height: 30px;
  justify-content: center;
  line-height: 1rem;
  position: absolute;
  right: 0;
  top: 0;
  transition: background-color 0.3s ease-in-out;
  width: 30px;
`;

export default class ReloadButton extends PureComponent {
  static defaultProps = {
    onClick: () => {},
    showReloadIcon: false,
  };

  constructor() {
    super();
    this.state = { hover: false };
  }

  onMouseEnter = () => {
    this.setState({ hover: true });
  };

  onMouseOut = () => {
    this.setState({ hover: false });
  };

  render() {
    const {
      props: { onClick, showReloadIcon },
      state: { hover },
    } = this;

    return (
      <StyledButton
        hover={hover}
        onClick={onClick}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseOut}
        showReloadIcon={showReloadIcon}
        title={i18n('txtReloadData')}
      >
        {showReloadIcon ? (
          <IconReload color={hover ? '#fff' : '#205081'} />
        ) : (
          <IconLogo />
        )}
      </StyledButton>
    );
  }
}
