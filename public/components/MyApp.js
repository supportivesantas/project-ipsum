import React from 'react';
import actions from '../actions/ipsumActions.js';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { renderChart } from '../D3graphTemplate';
import { Panel, Grid, Row, Col, Clearfix, PageHeader, ListGroup, ListGroupItem} from 'react-bootstrap';
import request from '../util/restHelpers';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import barGraph from './BarGraph';
import _ from 'underscore';
import MyAppHistory from './MyAppHistory';
import Select from 'react-select';

class MyApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lineGraphRoute: null
    };
  }

  componentDidMount(){

    // call 24 hr bar graph data and render
    request.post('/getStats/serverTotalsForApp', {
      appid: this.props.state.appSelection.id,
      hours: 24
    }, (err, data) => {
      if (err) {console.log('ERROR', err); return; }
      var data = JSON.parse(data.text);
      var output = [];
      Object.keys(data).forEach((serverId) => {
        output.push({
          value: data[serverId].statValue,
          label: data[serverId].hostname,
          id: Number(serverId)
        });
      });
      this.props.dispatch(actions.CHANGE_APP_SERVER_TOTALS(output));
      barGraph('todayBarGraph', _.sortBy(this.props.state.appServerTotals, (obj) => {
        return -obj.value;
      }));
    });

    //For line Graph
    this.props.dispatch(actions.ADD_LINE_GRAPH_TITLE('/Total'));
    var appId = this.props.state.appSelection.id;
    request.post('/getStats/app',
      {appId: appId, hours: 24}, //TODO figure out how to keep track of desired hours, have user settings/config in store?
      (err, res) => {
        if (err) { console.log("Error getting Server Data", err); }
        this.props.dispatch(actions.ADD_SERVER_DATA(res.body));
        this.setState({lineGraphRoute: this.props.state.graphData[0].route}, () => {
          renderChart('lineGraph', this.props.state.graphData[0].data);
        })
    });
  }

  updateGraph(value) {
    !value ? null : 
    this.setState({lineGraphRoute: value.value}, () => {
      this.props.dispatch(actions.ADD_LINE_GRAPH_TITLE("/"+ value.value));
      var graphData  = this.props.state.graphData;
      d3.select('#lineGraph > svg').remove();
      renderChart('lineGraph', _.findWhere(graphData, {route: value.value}).data);
    });
  }

  tableLinkForm(cell) {
    return (
      <Link to="/myServer">
        <div onClick={this.goToServer.bind(this, cell)}>
          {_.findWhere(this.props.state.servers, {id: cell}).active}
        </div>
      </Link>
      );
  }

  goToServer(cell) {
    this.props.dispatch(actions.ADD_SERVER_SELECTION(_.findWhere(this.props.state.servers, {id: cell})));
  }

  enumFormatter(cell, row, enumObject) {
    return enumObject(cell);
  }

  render() {
    var sortedServerTotals = _.sortBy(this.props.state.appServerTotals, (obj) => {
        return -obj.value;
      });
    var statusData = sortedServerTotals.map((total, idx) => {
      return {
        label: total.label,
        status: _.findWhere(this.props.state.servers, {id: total.id}).active,
        id: total.id
      }
    })
    var lineGraphOptions = this.props.state.graphData.map((graph) => {return {label: '/'+graph.route, value: graph.route}})

    return (
       <Grid>
        <Row><Col xs={12} md={12}><PageHeader>{this.props.state.appSelection.appname} <small>at a glance</small></PageHeader></Col></Row>
        <Row className="app-control-panel">
          <Col xs={12} md={12}>
            <Panel header={<h1>Control Panel</h1>}>
            Cool controls to come! Scale up, scale down, emergency shut down, etc.
            </Panel>
          </Col>
        </Row>

        <Row className='serverStatContainer'>

          <Col xs={12} lg={12} >
            <h2>What{'\''}s Happening</h2>
            <Panel header={<div>Routes</div>} >
            <Grid fluid>
            <Row>
            <Col xs={12} lg={12}>
              <Select
                value={this.state.lineGraphRoute}
                multi={false}
                options={lineGraphOptions}
                onChange={this.updateGraph.bind(this)}
                />
              <h3 className="linegraph-title">Hits Per Hour Today</h3>
              <p className="xAxis-subtitle">for {this.props.state.lineGraphTitle == '/Total' ? 'all monitored routes' : <i>{this.props.state.lineGraphTitle}</i>}</p>

              <div id="lineGraph"></div>
              <h5 className="xAxis-title">Hours Ago</h5>

            </Col>
            </Row>
            </Grid>
            </Panel>
          </Col>

        </Row>
        <Row>
          <Col xs={12} md={12}>
            <Panel header={<h1>Server Information</h1>}>
              <Grid fluid>
              <Row>
                <Col xs={12} md={6}>
                <h4>Relative load (24 hr)</h4>
                <div id="todayBarGraph"></div>
                </Col>

                <Col xs={12} md={6}>
                <h4>Status</h4>
                <BootstrapTable ref='table' data={statusData} striped={true} hover={true} >
                  <TableHeaderColumn isKey={true} dataField="label" dataAlign="center">Hostname</TableHeaderColumn>
                  <TableHeaderColumn dataAlign="center" dataField="id" dataFormat={this.enumFormatter} formatExtraData={this.tableLinkForm.bind(this)}>See Stats</TableHeaderColumn>
                </BootstrapTable>

              </Col>
              </Row>
              </Grid>
            </Panel>
          </Col>
        </Row>
        <MyAppHistory />
      </Grid>
    )
  }
}

MyApp = connect(state => ({ state: state }))(MyApp);
export default MyApp
