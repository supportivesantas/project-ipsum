import React from 'react';
import actions from '../actions/ipsumActions.js';
import { connect } from 'react-redux';
import { renderChart } from '../D3graphTemplate';
import { Panel, Grid, Row, Col, Clearfix, PageHeader, ListGroup, ListGroupItem } from 'react-bootstrap';
import request from '../util/restHelpers';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import BarGraph from './BarGraph';

class MyApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount(){
    // for bar graph
    request.post('/getStats/serverTotalsForApp', {
      appname: this.props.state.currentAppname, 
      hours: 24
    }, (err, data) => {
      var data = JSON.parse(data.text);
      var output = [];
      Object.keys(data).forEach((server) => {
        output.push({
          value: data[server].statValue,
          label: data[server].hostname || data[server].ip
        });
      this.props.dispatch(actions.CHANGE_APP_SERVER_TOTALS(output));
      });
    });
    //For line Graph
    this.props.dispatch(actions.ADD_LINE_GRAPH_TITLE('/Total'));
    var appId = appId || 2; //1 for testing, will need to connect with clicked server
    request.post('/getStats/app',
      {appId: appId, hours: 24}, //TODO figure out how to keep track of desired hours, have user settings/config in store?
      (err, res) => {
        if (err) { console.log("Error getting Server Data", err); }
        this.props.dispatch(actions.ADD_SERVER_DATA(res.body));
        renderChart('lineGraph', this.props.state.graphData[0].data);
    });
  }

  updateGraph(graph) {
    this.props.dispatch(actions.ADD_LINE_GRAPH_TITLE("/"+ graph.route));
    var graphData = this.props.state.graphData;
    d3.select('#lineGraph > svg').remove();
    var routeIndex;
    for (var i = 0; i < graphData.length; i++) {
      if (graphData[i].route === graph.route) {
        routeIndex = i;
        break;
      }
    }
    renderChart('lineGraph', graphData[routeIndex].data);
  }

  render() {
    return (
       <Grid>
        <Row><Col xs={12} md={12}><PageHeader>{this.props.state.currentAppname} <small>at a glance</small></PageHeader></Col></Row>
        <Row className="app-control-panel">
          <Col xs={12} md={12}>
            <Panel header={<h1>Control Panel</h1>}>
            Cool controls to come! Scale up, scale down, emergency shut down, etc.
            </Panel>
          </Col>
        </Row>

        <h2>Todays Traffic</h2>
        <Row className='serverStatContainer'>

          <Col xs={12} lg={4} >
            <Panel header={<div>Routes</div>} >
              <ListGroup className='server-route-list'>
               {this.props.state.graphData.map(graph =>
                  <ListGroupItem className='routePanel' onClick={this.updateGraph.bind(this, graph)}>
                    /{graph.route}
                  </ListGroupItem>
                )}
             </ListGroup>
           </Panel>
          </Col>
          <Col xs={12} lg={8}>
            <Panel header={<div>Route: <strong>{this.props.state.lineGraphTitle[0]}</strong></div>} >
              <h5 className="xAxis-title">Hits Per Hour</h5>
              <div id="lineGraph"></div>
              <h5 className="xAxis-title">Hours Ago</h5>
            </Panel>
          </Col>

        </Row>
        <hr />
        <Row>
          <Col xs={6} md={6}>
            <Panel header={<h1>Relative Server Load</h1>} id="appGraph">
              {this.props.state.appServerTotals ? <BarGraph /> : <div>Loading...</div> }
            </Panel>
          </Col>
          <Col xs={6} md={6}>
            <Panel header={<h1>Server Statuses</h1>} id="yadda">
              <div>
                <div>SFO1: green (well under max)</div>
                <div>NYC2: yellow (close to max)</div>
                <div>HKG3: red (down)</div>
              </div>
            </Panel>
          </Col>
         
        </Row>
        <h2>History</h2>
      </Grid>
    )
  }
}

MyApp = connect(state => ({ state: state }))(MyApp);
export default MyApp
