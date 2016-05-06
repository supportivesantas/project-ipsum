import React from 'react';
import { Navbar, Nav, NavDropdown, MenuItem, NavItem } from 'react-bootstrap';
import { Link } from 'react-router';
import NavLink from './NavLink.js';

const NavigationBar = () => {
  return (
    <Navbar className="navigation" fluid>
      <Navbar.Header>
        <Navbar.Brand>
          <NavLink to="/">Project-Ipsum</NavLink>
        </Navbar.Brand>
        <Navbar.Toggle />
      </Navbar.Header>
      <Navbar.Collapse >
        <Nav>
{/*          <NavDropdown eventKey={3} title="Dropdown" id="basic-nav-dropdown">
            <MenuItem eventKey={3.1}>Action</MenuItem>
            <MenuItem eventKey={3.2}>Another action</MenuItem>
            <MenuItem eventKey={3.3}>Something else here</MenuItem>
            <MenuItem divider />
            <MenuItem eventKey={3.3}>Separated link</MenuItem>
          </NavDropdown>*/}
        </Nav>
        <Nav pullRight>
          <NavItem eventKey={1} href="#"><NavLink to="/allApps">All Apps</NavLink></NavItem>
          <NavItem eventKey={2} href="#"><NavLink to="/allServers">All Servers</NavLink></NavItem>
          <NavItem eventKey={3} href="#"><NavLink to="/logout">Logout</NavLink></NavItem>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavigationBar;
