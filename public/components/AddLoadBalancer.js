import React from 'react';
import actions from '../actions/ipsumActions.js';
import { connect } from 'react-redux';
import request from '../util/restHelpers.js';
import { Button, Col, ControlLabel, FormControl, FormGroup, Grid, Panel, Row } from 'react-bootstrap';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

class AddLoadBalancer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Grid>
        <Row>
          <Panel header={<h1>Adding a Load Balancer Instructions</h1>}>
          </Panel>
        </Row>
        <Row>
          <Panel header={<h1>Enter Your Load Balancer Information</h1>}>
          </Panel>
        </Row>
      </Grid>
    );
  }
}

AddLoadBalancer = connect(state => ({state: state}))(AddLoadBalancer);
export default AddLoadBalancer;
