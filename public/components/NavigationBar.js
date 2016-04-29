import React from 'react';
import { Navbar, Nav, NavDropdown, MenuItem, NavItem } from 'react-bootstrap';
import { Link } from 'react-router';

const NavigationBar = () => {
  return (
    <Navbar>
      <Navbar.Header>
        <Navbar.Brand>
          <a href="#">Project-Ipsum</a>
        </Navbar.Brand>
        <Navbar.Toggle />
      </Navbar.Header>
      <Navbar.Collapse >
        <Nav>
          <NavItem eventKey={1} href="#">Link</NavItem>
          <NavItem eventKey={2} href="#">Link</NavItem>
{/*          <NavDropdown eventKey={3} title="Dropdown" id="basic-nav-dropdown">
            <MenuItem eventKey={3.1}>Action</MenuItem>
            <MenuItem eventKey={3.2}>Another action</MenuItem>
            <MenuItem eventKey={3.3}>Something else here</MenuItem>
            <MenuItem divider />
            <MenuItem eventKey={3.3}>Separated link</MenuItem>
          </NavDropdown>*/}
        </Nav>
        <Nav pullRight>
          <NavItem eventKey={1} href="#"><Link to="/allApps">All Apps</Link></NavItem>
          <NavItem eventKey={2} href="#"><Link to="/login">Login</Link></NavItem>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

// ReactDOM.render(NavigationBar, document.getElementById('nav'));
export default NavigationBar;
