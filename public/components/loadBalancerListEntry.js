import React from 'react';
import ReactDom from 'react-dom';
import actions from '../actions/ipsumActions.js';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import request from '../util/restHelpers';
import _ from 'underscore';
import { Button, Panel, Grid, Row, Col, Clearfix, PageHeader, ListGroup, ListGroupItem } from 'react-bootstrap';
import Select from 'react-select';
import style from '../styles/SelectStyle.css';

class LoadBalancerListEntry extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      image: null,
    };
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
          Minimum Threshold: {this.props.lb.min_threshold} <br/>
          Maximum Threshold: {this.props.lb.max_threshold} <br/>
          Server Limit: {this.props.lb.max_servers} <br/>
          Zone: {this.props.lb.zone} <br/>
          Port: {this.props.lb.port}
        </Col>
        <Col xs={12} md={4}>
          <h4>Slave Servers:</h4>
        </Col>
        <Col xs={12} md={4}>
          <h5 style={{color:'grey'}}>Current image:</h5>
          <h4> {this.props.lb.imageLabel}</h4>
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
