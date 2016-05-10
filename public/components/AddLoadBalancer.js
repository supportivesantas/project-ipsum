import React from 'react';
import actions from '../actions/ipsumActions.js';
import { connect } from 'react-redux';
import request from '../util/restHelpers.js';
import { Button, Col, ControlLabel, FormControl, FormGroup, Grid, Panel, Row, Form } from 'react-bootstrap';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

class AddLoadBalancer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nginxIp: null,
      nginxPort: null,
      zone: null,
    };
  }

  handleSubmit() {
    if (!this.state.nginxPort || !this.state.nginxIp || !this.state.zone) {
      alert("Please fill out each field, and double check that what you entered is correct");
    }
    console.log(this.state);
  }

  handleIp(e) {
    this.setState({
      nginxIp: e.target.value
    });
  }

  handlePort(e) {
    this.setState({
      nginxPort: e.target.value
    });
  }

  handleZone(e) {
    this.setState({
      zone: e.target.value
    });
  }

  render() {
    return (
      <Grid>
        <Row>
          <Panel header={<h1>Add a Load Balancer</h1>}>
            <Grid fluid>
              <Row>
                <Col xs={12} lg={4}>
                  <h3 style={{textDecoration:'underline'}}> Sample File: </h3>
                  <pre className='sampleSnippet'>
                    <code>
                    {"upstream ZONE_NAME_HERE {"}{"\n"}
                      &nbsp;&nbsp;zone upstream_ZONE_NAME_HERE 64k;{"\n"}
                      &nbsp;&nbsp;server 1.1.1.1:3000;{"\n"}
                      &nbsp;&nbsp;server 2.2.2.2:3000;{"\n"}
                     }{"\n"}

                     {"server {"}{"\n"}
                      &nbsp;&nbsp;listen YOUR_PORT_HERE;{"\n"}

                      &nbsp;&nbsp;{"location {"}{"\n"}
                        &nbsp;&nbsp;&nbsp;&nbsp;proxy_pass http://ZONE_NAME_HERE;{"\n"}
                      &nbsp;&nbsp;}{"\n"}

                      &nbsp;&nbsp;{"location /upstream_conf {"}{"\n"}
                          &nbsp;&nbsp;&nbsp;&nbsp;upstream_conf;{"\n"}
                          &nbsp;&nbsp;&nbsp;&nbsp;allow 127.0.0.1;{"\n"}
                          &nbsp;&nbsp;&nbsp;&nbsp;allow OUR_DEPLOYMENT_SERVER_HERE;{"\n"}
                          &nbsp;&nbsp;&nbsp;&nbsp;deny all;{"\n"}
                      &nbsp;&nbsp;}{"\n"}
                     }
                    </code>
                  </pre>
                </Col>
                <Col xs={12} lg={8}>
                  <h3 style={{textDecoration:'underline'}}> Instructions: </h3>
                      CONFIG INSTRUCTIONS HERE
                </Col>
              </Row>
              <Form horizontal ref="laodInputs">
                <h4 style={{textDecoration:'underline', marginTop: "50px"}}>Enter Your Load Balancer Information:</h4>
                  <Col xs={6} lg={3}>
                      <ControlLabel>NGINX IP Address:</ControlLabel>
                      <FormControl onChange={this.handleIp.bind(this)} value={this.state.nginxIp}/>
                  </Col>
                  <Col xs={6} lg={3}>
                      <ControlLabel>NGINX Port:</ControlLabel>
                      <FormControl onChange={this.handlePort.bind(this)} value={this.state.nginxPort}/>
                  </Col>
                  <Col xs={6} lg={3}>
                      <ControlLabel>Zone:</ControlLabel>
                      <FormControl onChange={this.handleZone.bind(this)} value={this.state.zone}/>
                  </Col>
                  <Col xs={6} lg={3}>
                      <h1></h1>
                      <Button  onClick={this.handleSubmit.bind(this)} bsSize="large" bsStyle="success">
                        Add Load Balancer
                      </Button>
                  </Col>
              </Form>
            </Grid>
          </Panel>
        </Row>
      </Grid>
    );
  }
}

AddLoadBalancer = connect(state => ({state: state}))(AddLoadBalancer);
export default AddLoadBalancer;
