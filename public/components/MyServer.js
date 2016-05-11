import React from 'react';
import actions from '../actions/ipsumActions.js';
import { connect } from 'react-redux';
import { renderChart } from '../D3graphTemplate';
import { Panel, Grid, Row, Col, Clearfix, PageHeader, ListGroup, ListGroupItem } from 'react-bootstrap';
import request from '../util/restHelpers.js';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import Select from 'react-select';
import _ from 'underscore';
import { LineChart } from 'rd3';

class MyServer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lineGraphRoute: null,
      lineGraphOptions: null,
      lineGraphDataRaw: null
    };
  }

  componentDidMount() { 
    this.props.dispatch(actions.ADD_LINE_GRAPH_TITLE('/Total'));
    var servId = this.props.state.serverSelection.id;
    request.post('/getStats/server',
      {serverId: servId, hours: 24}, //TODO figure out how to keep track of desired hours, have user settings/config in store?
      (err, res) => {
        if (err) { console.log("Error getting Server Data", err); }
        this.props.dispatch(actions.ADD_SERVER_DATA(res.body));
        this.setState({
          lineGraphOptions: this.props.state.graphData.map((graph) => {return {label: '/'+graph.route, value: graph.route}}),
          lineGraphRoute: this.props.state.graphData[0].route,
          lineGraphDataRaw:  this.props.state.graphData[0].data
        });
      }
    );

  }

  updateGraph(value) {
    if (value !== null) {
      this.props.dispatch(actions.ADD_LINE_GRAPH_TITLE("/"+ value.value));
      this.setState({
        lineGraphRoute: value.value,
        lineGraphDataRaw: _.findWhere(this.props.state.graphData, {route: value.value}).data
      })
    }
  }

  render() {

    var lineGraphData= [
          { 
            name: 'series1',
            values: this.state.lineGraphDataRaw.map( hour => { return {x: hour.time, y: hour.hits} }),
            strokeWidth: 3,
            strokeDashArray: "5,5"
          }]


    return (
      <Grid>
        <Row><Col xs={12} md={12}><PageHeader>{this.props.state.serverSelection.hostname} <small>at a glance</small></PageHeader></Col></Row>
        <Row className="server-control-panel">
          <Col xs={12} md={12}>
            <Panel header={<h1>Control Panel</h1>}>
            Cool controls to come! Scale up, scale down, emergency shut down, etc.<br/>
              <span style={{textDecoration:'underline'}}>Server:  </span> {this.props.state.serverSelection.hostname}<br/>
              <span style={{textDecoration:'underline'}}>IP:  </span> {this.props.state.serverSelection.ip}<br/>
              <span style={{textDecoration:'underline'}}>Status:  </span> {this.props.state.serverSelection.active}<br/>
              <span style={{textDecoration:'underline'}}>Platform:  </span> {this.props.state.serverSelection.platform}<br/>
            </Panel>
          </Col>
        </Row>


        <Row className='serverStatContainer'>
        <Col xs={12} md={12} lg={12}>
        <Panel header={<div>Routes</div>}>
        <Grid fluid>
          <Row>
            <Col xs={12} lg={12}>
              <Select
                value={this.state.lineGraphRoute}
                multi={false}
                options={this.state.lineGraphOptions}
                onChange={this.updateGraph.bind(this)}
                />
              <h5 className="xAxis-title">Server Traffic</h5>
              <p className="xAxis-subtitle">for {this.props.state.lineGraphTitle == '/Total' ? 'all monitored routes' : <i>{this.props.state.lineGraphTitle}</i>}</p>
              <div id="lineGraph"></div>

            </Col>
          </Row>
        </Grid>
        </Panel>
        </Col>
        </Row>
      </Grid>
    );
  }
}

  // {this.props.state.graphData.map(graph =>
  //    <Panel className='routePanel' onClick={this.updateGraph.bind(this, graph)}>
  //      <p>/{graph.route}</p>
  //    </Panel>
  //  )}

MyServer = connect(state => ({ state: state }))(MyServer);
export default MyServer;
