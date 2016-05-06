import React from 'react';
import actions from '../actions/ipsumActions.js';
import { connect } from 'react-redux';
import { renderChart } from '../D3graphTemplate';
import { Panel, Grid, Row, Col, Clearfix } from 'react-bootstrap';
import request from '../util/restHelpers';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import BarGraph from './BarGraph'

export default class MyApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hours: 168,
      data: null
    };
  }

  componentDidMount(){
    request.post('http://localhost:1337/getStats/serverTotalsForApp', {
      appid: this.props.appid || 5, // 'TODO:' remove the OR statement before deploying
      appname: this.props.appname || "follower", // TODO: remove the OR statement before deploying
      hours: 168 // defaults to totals for 1 week
    }, (err, data) => {
      var data = JSON.parse(data.text);
      var output = [];
      Object.keys(data).forEach((server) => {
        output.push({
          value: data[server].statValue, 
          label: data[server].hostname || data[server].ip
        });
      }); 
      this.setState({data: output});
    })
  }

  render() {
    return (
      <Grid>
        <Row className="app-control-panel">
          <Col xs={12} md={12}>
            <Panel header={<h1>Application Control Panel</h1>}>
            <i>Note: Route traffic info aggregates across all servers running the app</i> <br/>
            </Panel>
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={4}>
            <Panel header={<div>Some Other Info</div>} id="yadda">
              <strong>Some Other Info</strong>
            </Panel>
          </Col>
          <Col xs={12} md={8}>
            <Panel header={<div>{this.props.appname || 'Test App Name'}</div>} id="appGraph">
              <strong>Relative Server Load</strong>
              {this.state.data ? <BarGraph data={this.state.data}/> : <div>Loading...</div> }
            </Panel>
          </Col>
        </Row>
      </Grid>
    )
  }
}
