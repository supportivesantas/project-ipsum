import React from 'react';
import ReactDom from 'react-dom';
import actions from '../actions/ipsumActions.js';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import request from '../util/restHelpers';
import _ from 'underscore';
import { Button, Panel, Grid, Row, Col, Clearfix, PageHeader, ListGroup, ListGroupItem, Form, FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import Select from 'react-select';
import style from '../styles/SelectStyle.css';

class LoadBalancerListEntry extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      image: null,
      max_threshold: this.props.lb.max_threshold,
      min_threshold: this.props.lb.min_threshold,
      max_servers: this.props.lb.max_servers
    };
    this.max_servers_options = _.range(1, 6).map( (el) => { return {value: el, label: el}});
  }

  handleImage(e) {
    this.setState({
      image: e.value
    });
  }

  handleSubmit() {
    if (!this.state.image) { return; }
    request.put('/nginx/balancers', {
        loadBalancerId: this.props.lb.id,
        image: this.state.image
      }, (error, res) => {
        request.get('/nginx/balancers', (error, res) => {
          this.props.remount();
        });
    });
  }

  render() {
    return (
      <Row style={{borderBottom:"1px solid grey", paddingBottom:"20px"}}>
        <h3> <span style={{fontSize:"16px", color:'grey'}}>Load Balancer At IP:</span> {this.props.lb.ip} </h3>
        <Col xs={12} md={4}>
        <h4>Info:</h4>
          <p>Zone: {this.props.lb.zone}</p>
          <p>Port: {this.props.lb.port}</p><br/>
          <h4>Settings:</h4>

          <Form horizontal>
             <FormGroup controlId="formHorizontalEmail">
               <Col componentClass={ControlLabel} sm={6}>
                 Minimum Threshold
               </Col>
               <Col sm={6}>
                 <FormControl type="min_threshold" placeholder={this.state.min_threshold} />
               </Col>
             </FormGroup>

             <FormGroup controlId="formHorizontalPassword">
               <Col componentClass={ControlLabel} sm={6}>
                 Maximum Threshold
               </Col>
               <Col sm={6}>
                 <FormControl type="max_threshold" placeholder={this.state.max_threshold} />
               </Col>
             </FormGroup>

             <FormGroup controlId="formHorizontalPassword">
               <Col componentClass={ControlLabel} sm={6}>
                 Max Servers
               </Col>
               <Col sm={6}>
                 <FormControl type="max_servers" placeholder={this.state.max_servers} />
               </Col>
             </FormGroup>

             <FormGroup>
               <Col smOffset={2} sm={10}>
                 <Button type="submit">
                   Update
                 </Button>
               </Col>
             </FormGroup>
           </Form>

      
        </Col>
        <Col xs={12} md={4}>
          <h4>Slave Servers:</h4>
            { _.map(this.props.state.slaveServers[this.props.lb.slavesArrayIndex], (slave) => {
              return <li> {slave.hostname} @ {slave.ip}</li>
            })}
        </Col>
        <Col xs={12} md={4}>
          <h4>Current image:</h4>
          <p> {this.props.lb.imageLabel}</p>
          <Select value={this.state.image} options={this.props.state.imageList} clearable={false} name='imageSelect' onChange={this.handleImage.bind(this)} />
          <div style={{"margin":"auto", "textAlign":"center"}}>
            <Button style={{"marginTop":"25px"}} onClick={this.handleSubmit.bind(this)} bsStyle="success">
              Update Image
            </Button>
          </div>
        </Col>
      </Row>
    )
  }
}

LoadBalancerListEntry = connect(state => ({ state: state }))(LoadBalancerListEntry);
export default LoadBalancerListEntry
