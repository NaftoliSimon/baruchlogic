import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Navbar } from '@blueprintjs/core';
import { Icon } from '@blueprintjs/core';

const StyledNavbar = styled(Navbar)`
  &&& {
    background-color: #2d0f4c;
    display: flex;
    align-items: center;
    height: 4rem;
    justify-content: space-between;
    padding: 0 4rem;
    @media (max-width: 750px) {
      flex-direction: column;
      height: auto;
    }
  }
`;

const StyledLink = styled(Link)`
  &&& {
    color: white;
    font-size: 1.5rem;
    transition: color 0.1s linear;
    &:hover {
      color: #669eff;
      text-decoration: none;
    }
  }
`;

const StyledUserIcon = styled(Icon)`
  &&& {
    color: white;
    cursor: pointer;
    transition: color 0.1s linear;
    &:hover {
      color: #669eff;
    }
  }
`;

const StyledDivider = styled(Navbar.Divider)`
  @media (max-width: 750px) {
    transform: rotateZ(90deg);
  }
`;

const Header = () => (
  <StyledNavbar>
    <StyledLink to="/">home</StyledLink>
    <StyledLink to="/about">about</StyledLink>
    <StyledLink to="/text">text</StyledLink>
    <StyledLink to="/videos">videos</StyledLink>
    <StyledLink to="/exercises">exercises</StyledLink>
    <StyledLink to="/homework">homework</StyledLink>
    <StyledDivider />
    <Navbar.Group>
      <Link to="/login">
        <StyledUserIcon icon="user" iconSize={32} />
      </Link>
    </Navbar.Group>
  </StyledNavbar>
);

export default Header;
