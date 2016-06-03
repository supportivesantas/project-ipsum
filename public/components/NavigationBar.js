import React from 'react';
import { Navbar, Nav, NavItem, Image} from 'react-bootstrap';
import { LinkContainer, IndexLinkContainer } from 'react-router-bootstrap';
import { connect } from 'react-redux';

var NavigationBar = (props) => {
  return (
    <Navbar className="navigation" fluid>
      <Navbar.Header>
          <img style={{width: 40, height: 40}} src="assets/logo/logo_stroke_noedge.svg" />
        <Navbar.Brand>
          <IndexLinkContainer to="/"><NavItem eventKey={1} href="#">DJ Deploy</NavItem></IndexLinkContainer>
        </Navbar.Brand>
        <Navbar.Toggle />
      </Navbar.Header>
      <Navbar.Collapse >

        <Nav pullRight>
          <IndexLinkContainer to="/"><NavItem eventKey={1} href="#">All Apps</NavItem></IndexLinkContainer>
          <LinkContainer to="/allServers"><NavItem eventKey={2} href="#">All Servers</NavItem></LinkContainer>
          <LinkContainer to="/tokens"><NavItem eventKey={3} href="#">Tokens</NavItem></LinkContainer>
          <LinkContainer to="/loadBalancer"><NavItem eventKey={4} href="#">Load Balancers</NavItem></LinkContainer>
          <LinkContainer to="/logout"><NavItem eventKey={5} href="#">Logout {props.state.user.handle ? <u>{props.state.user.handle}</u>  : null}</NavItem></LinkContainer>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
    )
}

NavigationBar = connect(state => ({ state: state }))(NavigationBar);
export default NavigationBar;