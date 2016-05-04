import React from 'react';
import actions from '../actions/ipsumActions.js';
import { connect } from 'react-redux';
import maps from '../mappingFunctions.js';
import { Grid, Panel, Col, Row, Well, Button, Jumbotron, Container, Image } from 'react-bootstrap';

const headers = {
  1: <h3> Management </h3>,
  2: <h3> Monitoring </h3>,
  3: <h3> Middleware </h3>,
};
class Login extends React.Component {

  handleSubmit(e) {
    e.preventDefault();
    // do login with github here
    window.location.href = '/auth/github';
  }

  render() {
    return (
      <Grid fluid>
        <Row>
          <Jumbotron>
            <Row>
              <Col xs={12} sm={8}>
                <h2> Welcome to Project Ipsum! </h2>
                <p> The easiest way to manage all your deployment servers </p>
              </Col>
              <Col xs={12} sm={4} >
                <Col sm={8}>
                  <h6> Get started with Github </h6>

                  <Button
                    bsStyle="success"
                    type="submit"
                    onClick={this.handleSubmit.bind(this)}
                    block
                  >Login</Button>
                </Col>
              </Col>
            </Row>
          </Jumbotron>
        </Row>
        <Row>
          <Col lg={12}>
            <Well>Get started with Project Ipsum Today! Free for personal use! </Well>
          </Col>
        </Row>
        <Row>
          <Col xsHidden sm={4}>
            <Panel header={headers[1]}>
              Manage all your deployment servers in one place! Heroku, Digital Ocean, AWS, and Azure supported!
            </Panel>
          </Col>
          <Col xsHidden sm={4}>
            <Panel header={headers[2]}>
              Get real time data on all your servers, applications, and even individual API endpoints!
            </Panel>
          </Col>
          <Col xsHidden sm={4}>
            <Panel header={headers[3]}>
              Add our proprietary middleware to your applications, and watch the data flow!
            </Panel>
          </Col>
        </Row>
      </Grid>

    );
  }
}

Login = connect(state => ({ state: state }))(Login);
export default Login;
