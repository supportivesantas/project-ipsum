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

  componentWillMount() {
    console.log(this.props.renderLoadBalancer);

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
        console.log("IMAGE UPDATE LB", res.body);
        request.get('/nginx/balancers', (error, res) => {
          this.props.renderLoadBalancer()
          // this.props.dispatch(actions.POPULATE_LOAD_BALANCERS(res.body));
        });
    });

  }

  render() {
    return (
      <Row>
        <h3> Load Balancer At IP: {this.props.lb.ip} </h3>
        <Col xs={12} md={6}>
          <h4>Info:</h4>
        </Col>
        <Col xs={12} md={6}>
          <h4>Current image: {this.props.lb.imageLabel}</h4>
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
