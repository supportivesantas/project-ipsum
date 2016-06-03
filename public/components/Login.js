import React from 'react';
import actions from '../actions/ipsumActions.js';
import { connect } from 'react-redux';
import maps from '../mappingFunctions.js';
import NavigationBarLogin from './NavigationBarLogin.js';
import { Grid, Panel, Col, Row, Jumbotron } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { Link } from 'react-router';
import Footer from './Footer.js';

var Login = () => {
  return (

    <div className="outerContainer" >
    <Grid fluid className="mainContainer" >
    <Row><Col>
      <NavigationBarLogin />
    </Col></Row>

    <Row><Col md={12}>
      <Jumbotron className="loginJumbo">
        <Row>
          <Col xs={12} sm={8}>
            <h1> The easiest way to manage all your deployments</h1>
            <Link to={'/about'}>Take the tour</Link>
          </Col>
        </Row>
      </Jumbotron>
    </Col></Row>

    <Row><Col md={12}>
      <div className='layout-middle'>
        <div className='layout-middle-img-cover' style={{backgroundImage: 'url(assets/img/using-phone.jpg)'}}></div>
        <div className='layout-middle-text'>
          <h1> <small> Control</small> </h1>
          <h3> The freedom to let go </h3>
          <p>Manage all your deployment servers in one place. Heroku, Digital Ocean, AWS, and Azure supported</p>
        </div>
      </div>
    </Col></Row>

    <Row><Col md={12}>
    <div className='layout-middle flip'>
      <div className='layout-middle-img-cover' style={{backgroundImage: 'url(assets/img/servers.jpg)'}}></div>
      <div className='layout-middle-text'>
        <h1> <small> Trust</small> </h1>
        <h3> A robust service at your disposal </h3>
        <p>Add our proprietary middleware to your applications, and watch the data flow!</p>
      </div>
    </div>
    </Col></Row>

    <Row><Col md={12}>
    <div className='layout-middle'>
      <div className='layout-middle-img-cover' style={{backgroundImage: 'url(assets/img/woman.jpg)'}}>
      </div>
      <div className='layout-middle-text'>
        <h1> <small>Insight</small> </h1>
        <h3> Data you can depend on </h3>
        <p>Get real time data on all your servers, applications, and even individual API endpoints!</p>
      </div>
    </div>
    </Col></Row>
    
    </Grid>

    <Footer />
    </div>

    )

}

Login = connect(state => ({ state: state }))(Login);
export default Login;
