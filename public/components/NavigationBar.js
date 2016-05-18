import React from 'react';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import { LinkContainer, IndexLinkContainer } from 'react-router-bootstrap';
import { connect } from 'react-redux';


class NavigationBar extends React.Component {
  render() {

    return (
      <Navbar className="navigation" fluid>
        <Navbar.Header>
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
            <LinkContainer to="/logout"><NavItem eventKey={5} href="#">Logout {this.props.state.user.handle ? this.props.state.user.handle  : null}</NavItem></LinkContainer>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
    
  }
};

NavigationBar = connect(state => ({ state: state }))(NavigationBar);
export default NavigationBar;