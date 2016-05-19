import React from 'react';
import { Navbar, Nav, NavItem, Button} from 'react-bootstrap';
import { LinkContainer, IndexLinkContainer, Image } from 'react-router-bootstrap';

var handleSubmit = (e) => {
  e.preventDefault();
  // do login with github here
  window.location.href = '/auth/github';
}

const NavigationBarLogin = () => {
  return (
    <Navbar className="navigation-login" fluid>
      <Navbar.Header>
      <img style={{width: 40, height: 40}} src="assets/logo/logo_stroke_noedge.svg" />
        <Navbar.Brand>
          <IndexLinkContainer to="/"><NavItem eventKey={1} href="#">DJ Deploy</NavItem></IndexLinkContainer>
        </Navbar.Brand>
        <Navbar.Toggle />
      </Navbar.Header>
      <Navbar.Collapse >

        <Nav pullRight>
          <LinkContainer to="/about"><NavItem href="#">About</NavItem></LinkContainer>
          <LinkContainer to="/"><NavItem href="#" onClick={handleSubmit}>GithubLogin</NavItem></LinkContainer>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavigationBarLogin;
