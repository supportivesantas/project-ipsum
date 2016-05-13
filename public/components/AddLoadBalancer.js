import React from 'react';
import actions from '../actions/ipsumActions.js';
import { connect } from 'react-redux';
import request from '../util/restHelpers.js';
import { Button, Col, ControlLabel, FormControl, FormGroup, Grid, Panel, Row, Form } from 'react-bootstrap';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

const selectRowProp = {
  mode: 'checkbox',
  bgColor: 'rgb(238, 193, 213)',
};

class AddLoadBalancer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ip: "",
      port: "",
      zone: "",
      image: "",
    };
  }

  componentDidMount() {
    //TODO: fetch images list and load balancers list (how do we associate load balancers to servers)

    request.get('/api/list_all_images', (error, res) => {
      if (error) {console.log("Error getting image list", error)}
      console.log(res);
    });

    //sample before adding restHandlers
    this.props.dispatch(actions.POPULATE_LOAD_BALANCERS([{
      id: "#",
      ip: "1.1.1.1",
      hostname: "IDK",
      platform: "azDOaws",
      active: "Elite",
      apps: "Coool" }]));
    // console.log(this.props.state.loadBalancers);
  }

  handleSubmit() {
    if (!this.state.port || !this.state.ip || !this.state.zone || !this.state.image) {
      alert("Please fill out each field, and double check that what you entered is correct");
    } else {
      request.post('/nginx/balancers', this.state, (error, res) => {
        if (error) {console.log("Error adding new lb",error)}
        console.log("THIS IS THE RESPONSE", res);
      });
    }
  }

  handleIp(e) {
    this.setState({
      ip: e.target.value
    });
  }

  handlePort(e) {
    this.setState({
      port: e.target.value
    });
  }

  handleZone(e) {
    this.setState({
      zone: e.target.value
    });
  }

  handleImage(e) {
    this.setState({
      image: e.target.value
    });
  }

  render() {
    return (
      <Grid>

        <Row>
          <Col md={12} xs={12}>
            <BootstrapTable ref='table' data={this.props.state.loadBalancers} striped={true} hover={true} selectRow={selectRowProp} search={true}>
              <TableHeaderColumn dataField="id" isKey={true} dataAlign="center" dataSort={true}>Load Balancer ID</TableHeaderColumn>
              <TableHeaderColumn dataField="ip" dataAlign="center" dataSort={true}>Load Balancer IP</TableHeaderColumn>
              <TableHeaderColumn dataField="hostname" dataAlign="center" dataSort={true}>Hostname</TableHeaderColumn>
              <TableHeaderColumn dataField="platform" dataSort={true}>Platform</TableHeaderColumn>
              <TableHeaderColumn dataField="active" dataSort={true}>Status</TableHeaderColumn>
              <TableHeaderColumn dataField="apps" dataSort={true}>Application</TableHeaderColumn>
            </BootstrapTable>
          </Col>
        </Row>

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
                  <pre className="instructions">
                      &nbsp;&nbsp;1) On your load balancing server running nginx, navigate to <strong>/etc/nginx.</strong>{"\n"}
                      &nbsp;&nbsp;2) In nginx.conf, ensure the following line is present:{"\n"}
                       &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>include /etc/nginx/sites-enabled/*;</strong>{"\n"}
                      &nbsp;&nbsp;3) In <strong>/etc/nginx/sites-enabled/</strong>, setup a file like the example file on this page{"\n"}
                         &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>PORT:</strong> The port your load balancer listens on{"\n"}
                         &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>ZONE:</strong> String identifier. Can be whatever you want.{"\n"}
                       &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The second 'allow' statement in the example config gives us the {"\n"}
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ability to control your balancer for you.{"\n"}
                     &nbsp;&nbsp;4) Fill out the form below, and watch the magic of DJ Deploy happen!{"\n"}
                  </pre>
                </Col>
              </Row>
              <Form horizontal ref="loadInputs">
                <h4 style={{textDecoration:'underline', marginTop: "50px"}}>Enter Your Load Balancer Information:</h4>
                  <Col xs={6} lg={3}>
                      <ControlLabel>NGINX IP Address:</ControlLabel>
                      <FormControl onChange={this.handleIp.bind(this)} value={this.state.ip}/>
                  </Col>
                  <Col xs={6} lg={3}>
                      <ControlLabel>NGINX Port:</ControlLabel>
                      <FormControl onChange={this.handlePort.bind(this)} value={this.state.port}/>
                  </Col>
                  <Col xs={6} lg={3}>
                      <ControlLabel>Zone:</ControlLabel>
                      <FormControl onChange={this.handleZone.bind(this)} value={this.state.zone}/>
                  </Col>
                  <Col xs={6} lg={3}>
                      <ControlLabel>Image id for adding servers:</ControlLabel>
                      <FormControl onChange={this.handleImage.bind(this)} value={this.state.image}/>
                  </Col>
              </Form>
                  <Row>
                    <div style={{"margin":"auto", "textAlign":"center"}}>
                      <Button style={{"margin":"30px 0"}} onClick={this.handleSubmit.bind(this)} bsSize="large" bsStyle="success">
                        Add Load Balancer
                      </Button>
                    </div>
                  </Row>
            </Grid>
          </Panel>
        </Row>
      </Grid>
    );
  }
}

AddLoadBalancer = connect(state => ({state: state}))(AddLoadBalancer);
export default AddLoadBalancer;
