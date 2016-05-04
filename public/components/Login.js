import React from 'react';
import actions from '../actions/ipsumActions.js';
import { connect } from 'react-redux';
import maps from '../mappingFunctions.js';
import { Grid, Panel, Col, Row, Well, Button, Jumbotron, Container, Image} from 'react-bootstrap';

class Login extends React.Component {

  handleSubmit(e) {
    e.preventDefault();
    // do login with github here
    window.location.href = '/auth/github';
  }

  render() {
    return (
      <div>
        <Jumbotron>
          <h2> Welcome to Project Ipsum! </h2>
          <p> The easiest way to manage all your deployment servers </p>
        </Jumbotron>
        <Col xsHidden={true} sm={4}>
          <Panel header={"Management"}>
            Manage all your deployment servers in one place! Heroku, Digital Ocean, AWS, and Azure supported!
          </Panel>
        </Col>
        <Col xsHidden={true} sm={4}>
          <Panel header={"Monitoring"}>
            Get real time data on all your servers, applications, and even individual API endpoints!
          </Panel>
        </Col>
        <Col xsHidden={true} sm={4}>
          <Panel header={"Middleware"}>
            Add our proprietary middleware to your applications, and watch the data flow!
          </Panel>
        </Col>
        <Col xs={8} xsOffset={2} sm={4} smOffset={4}>
          <div id="loginFormWrapper">
            <h2>Please login</h2>
            <Well>
              <Button
                bsStyle="success"
                bsSize="large"
                type="submit"
                onClick={this.handleSubmit.bind(this)}
                block
              >Login with Github</Button>
            </Well>
          </div>
        </Col>
      </div>
     
    );
  }
}

Login = connect(state => ({ state: state }))(Login);
export default Login;
