import React from 'react';
import { Navbar, Nav, NavItem, Button} from 'react-bootstrap';
import { LinkContainer, IndexLinkContainer, Image } from 'react-router-bootstrap';

var handleSubmit = (e) => {
  e.preventDefault();
  // do login with github here
  window.location.href = '/auth/github';
}

const NavigationBar = () => {
  return (
    <Navbar className="navigation" fluid>
      <Navbar.Header>
        <Navbar.Brand >
          <IndexLinkContainer to="/">
            <NavItem eventKey={1} href="#">
              DJ Deploy
            </NavItem>
          </IndexLinkContainer>
        </Navbar.Brand>
        <Navbar.Toggle />
      </Navbar.Header>
      <Navbar.Collapse >

        <Nav pullRight>
          <NavItem href="#" onClick={handleSubmit}>GithubLogin</NavItem>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavigationBar;
