import React from 'react';
import actions from '../actions/ipsumActions.js';
import { connect } from 'react-redux';
import maps from '../mappingFunctions.js';
import NavigationBarLogin from './NavigationBarLogin.js';
import { Navbar, Grid, Panel, Col, Row, Well, Button, Jumbotron, Container, Image, PageHeader } from 'react-bootstrap';

class Login extends React.Component {

  render() {
    return (
      <Grid fluid>
      <Row><Col>
        <NavigationBarLogin />
      </Col></Row>
        <Row>
          <Jumbotron className="loginJumbo">
            <Row>
              <Col xs={12} sm={8}>
                <h1> The easiest way to manage all your deployments</h1>
                <button className='tour-button'>Take a tour</button>
              </Col>
            </Row>
          </Jumbotron>
        </Row>
        <Row>
          <Grid fluid className='layout-middle'>
            <Row className='layout-middle-row'>
            <Col md={6} className='layout-middle-img-cover' style={{backgroundImage: 'url(assets/img/using-phone.jpg)'}}>
            </Col>
            <Col md={6} className='layout-middle-text'>
              <h1> <small> Control</small> </h1>
              <h3> The freedom to let go </h3>
              <p>Manage all your deployment servers in one place! Heroku, Digital Ocean, AWS, and Azure supported!</p>
            </Col>
            </Row>
          </Grid>
        </Row>
        <Row>
        <Grid fluid className='layout-middle'>
          <Row className='layout-middle-row'>
          <Col md={6} className='layout-middle-text'>
          <h1> <small>Trust</small> </h1>
          <h3> A robust service at your disposal </h3>
            <p>Add our proprietary middleware to your applications, and watch the data flow!</p>
          </Col>
          <Col md={6} className='layout-middle-img-cover' style={{backgroundImage: 'url(assets/img/servers.jpg)'}}>
          </Col>
          </Row>
        </Grid>
        </Row>
        <Row>
        <Grid fluid className='layout-middle'>
          <Row className='layout-middle-row'>
          <Col md={6} className='layout-middle-img-cover' style={{backgroundImage: 'url(assets/img/woman.jpg)'}}>
          </Col>
          <Col md={6} className='layout-middle-text'>
          <h1> <small>Insight</small> </h1>
          <h3> Data you can depend on</h3>
            <p>Get real time data on all your servers, applications, and even individual API endpoints!</p>
          </Col>
          </Row>
        </Grid>
        </Row>
        <Row>
          <Col sm={12} md={12} xs={12}>
            <h3> Technologies </h3> 
            <div className="technologies">
              <img className='techbadge' src="/assets/badges/react.png"/>
              <img className='techbadge' src="/assets/badges/redux.png"/>
              <img className='techbadge' src="/assets/badges/node.png"/>
              <img className='techbadge' src="/assets/badges/express.png"/>
              <img className='techbadge' src="/assets/badges/psql.png"/>
              <img className='techbadge' src="/assets/badges/redis.png"/>
              <img className='techbadge' src="/assets/badges/docker.png"/>
              <img className='techbadge' src="/assets/badges/nginx.png"/>
            </div>
          </Col>
        </Row>
        <Row>
        <Col md={12}>
            <h3>About</h3>
            <h4>The Team</h4>
          <Grid>
            <Row>
              <Col xs={6} md={3} style={{marginBottom: '1em', display: 'flex', alignItems: 'center', justifyContent: 'space-around', alignContent: 'center'}}>
                <Image width="150" src="https://avatars0.githubusercontent.com/u/15022604?v=3&s=460" responsive circle />
              </Col>
              <Col xs={6} md={3} style={{marginBottom: '1em', display: 'flex', alignItems: 'center', justifyContent: 'space-around', alignContent: 'center'}}>
                <Image width="150" src="https://avatars1.githubusercontent.com/u/15720430?v=3&s=460" responsive circle />
              </Col>
              <Col xs={6} md={3} style={{marginBottom: '1em', display: 'flex', alignItems: 'center', justifyContent: 'space-around', alignContent: 'center'}}>
                <Image width="150" src="https://avatars0.githubusercontent.com/u/9397100?v=3&s=460" responsive circle />
              </Col>
              <Col xs={6} md={3} style={{marginBottom: '1em', display: 'flex', alignItems: 'center', justifyContent: 'space-around', alignContent: 'center'}}>
                <Image width="150" src="https://avatars2.githubusercontent.com/u/16583445?v=3&s=460" responsive circle/>
              </Col>
            </Row>
          </Grid> 
        </Col>         
        </Row>
      </Grid>

    );
  }
}

Login = connect(state => ({ state: state }))(Login);
export default Login;
