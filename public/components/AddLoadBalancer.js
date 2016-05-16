import React from 'react';
import actions from '../actions/ipsumActions.js';
import ReactDom from 'react-dom';
import { connect } from 'react-redux';
import request from '../util/restHelpers.js';
import { Button, Col, ControlLabel, FormControl, FormGroup, Grid, Panel, Row, Form } from 'react-bootstrap';
import Select from 'react-select';
import _ from 'underscore';
import LoadBalancerListEntry from './loadBalancerListEntry.js';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

const selectRowProp = {
  mode: 'checkbox',
  bgColor: 'rgb(238, 193, 213)',
};

const getImagesAndLoadBalancers = (that) => {
  request.get('/nginx/balancers', (error, res) => {
    if (error) {console.log("Error getting Load Balancers", error)};
    let allLoadBalancers = res.body;
    request.get('/api/list_all_images', (error, res) => {
      if (error) {console.log("Error getting image list", error)}
      let imageList = res.body;
      let loadBalancersWithImageLabel = [];
      _.each(allLoadBalancers, (lb) => {
        let foundImage = _.findWhere(imageList, {value: lb.image});
        lb.imageLabel = foundImage ? foundImage.label : "No Image specified, please choose one now";
        loadBalancersWithImageLabel.push(lb);
      });
      let sortedLBs = _.sortBy(loadBalancersWithImageLabel, (obj) => {
        return -obj.id;
      });
      that.props.dispatch(actions.POPULATE_IMAGES(imageList));
      that.props.dispatch(actions.POPULATE_LOAD_BALANCERS(sortedLBs));
    });
  });
};

class AddLoadBalancer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ip: undefined,
      port: undefined,
      zone: undefined,
      image: undefined,
      min_threshold: undefined,
      max_threshold: undefined,
      max_servers: undefined,
      remount: 0,
    };
  }

  componentWillMount() {
    request.get('/nginx/slaves', (err, res) => {
      if (err) { console.log("Error: Could not get slaves", err); }
      console.log(res.body);
    });
  }

  componentDidMount() {
    getImagesAndLoadBalancers(this);
  }

  handleSubmit() {
    if (!this.state.port || !this.state.ip || !this.state.zone || !this.state.image) {
      alert("Please fill out each field, and double check that what you entered is correct");
    } else {
      request.post('/nginx/balancers', this.state, (error, res) => {
        if (error) {console.log("Error adding new lb",error)}
        this.remount();
        ReactDom.findDOMNode(this).scrollIntoView();
      });
      this.setState({
        ip: undefined,
        port: undefined,
        zone: undefined,
        image: undefined,
        min_threshold: undefined,
        max_threshold: undefined,
        max_servers: undefined,
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
      image: e.value
    });
  }

  handleMinThresh(e) {
    this.setState({
      min_threshold: e.target.value
    });
  }

  handleMaxThresh(e) {
    this.setState({
      max_threshold: e.target.value
    });
  }

  handleMaxServers(e) {
    this.setState({
      max_servers: e.target.value
    });
  }

  remount() {
    getImagesAndLoadBalancers(this);
    this.setState({
      remount: ++this.state.remount
    });
  }

  render() {
    return (
      <Grid key={this.state.remount}>

        <Row>
          <Panel header={<h1>Your Load Balancers</h1>}>
            <Grid fluid>
              {this.props.state.loadBalancers.map((loadBalancer) => {
                return <LoadBalancerListEntry key={loadBalancer.id} remount={this.remount.bind(this)}lb={loadBalancer} renderLoadBalancer={this.render.bind(this)}/>
              })}
            </Grid>
          </Panel>
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
                      <ControlLabel>NGINX Port:</ControlLabel>
                      <FormControl onChange={this.handlePort.bind(this)} value={this.state.port}/>
                  </Col>
                  <Col xs={6} lg={3}>
                      <ControlLabel>Zone:</ControlLabel>
                      <FormControl onChange={this.handleZone.bind(this)} value={this.state.zone}/>
                      <ControlLabel>Image for adding servers:</ControlLabel>
                      <Select value={this.state.image} options={this.props.state.imageList} clearable={false} name='imageSelect' onChange={this.handleImage.bind(this)} />
                  </Col>
                  <Col xs={6} lg={3}>
                      <ControlLabel>Minimum Threshold:</ControlLabel>
                      <FormControl type="number" onChange={this.handleMinThresh.bind(this)} value={this.state.min_threshold}/>
                      <ControlLabel>Maximum Threshold:</ControlLabel>
                      <FormControl type="number" onChange={this.handleMaxThresh.bind(this)} value={this.state.max_threshold}/>
                  </Col>
                  <Col xs={6} lg={3}>
                      <ControlLabel>Max Number of Servers:</ControlLabel>
                      <FormControl type="number" onChange={this.handleMaxServers.bind(this)} value={this.state.max_servers}/>
                      <div style={{"margin":"auto", "textAlign":"center"}}>
                        <Button style={{"marginTop":"25px"}} onClick={this.handleSubmit.bind(this)} bsStyle="success">
                          Add Load Balancer
                        </Button>
                      </div>
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
