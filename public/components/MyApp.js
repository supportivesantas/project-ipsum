import React from 'react';
import actions from '../actions/ipsumActions.js';
import { connect } from 'react-redux';
import { renderChart } from '../D3graphTemplate';
import { Panel, Grid, Row, Col, Clearfix } from 'react-bootstrap';
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
    //For server totals bar graph
    // d3.selection.prototype.first = function() {
    //   return d3.select(this[0][0]);
    // };
    // var svgs
    request.post('/getStats/serverTotalsForApp', {
      appid: this.props.appid || 5, // 'TODO:' remove the OR statement before deploying
      appname: this.props.currentAppname || "follower", // TODO: remove the OR statement before deploying
      hours: 168 // defaults to totals for 1 week
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
    d3.select('#lineGraph').remove();
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
        <Row className="app-control-panel">
          <Col xs={12} md={12}>
            <Panel header={<h1>Application Control Panel</h1>}>
            <i>Note: Route traffic info aggregates across all servers running the app</i> <br/>
            Summary: 9/10 servers for this application are running

            <div><button>Refresh</button></div>
            </Panel>
          </Col>
        </Row>

        <Row>
          <Col xs={12} md={12}>
            <Panel header={<div>Summary</div>} >

            </Panel>
          </Col>
        </Row>

        <Row className='serverStatContainer'>
          <Col xs={12} lg={4} >
            <Panel header={<div>Routes</div>} >
              <div className='server-route-list'>
               {this.props.state.graphData.map(graph =>
                  <Panel className='routePanel' onClick={this.updateGraph.bind(this, graph)}>
                    <p>/{graph.route}</p>
                  </Panel>
                )}
             </div>
           </Panel>
          </Col>
          <Col xs={12} lg={8}>
            <Panel header={<div>{this.props.state.lineGraphTitle[0]}</div>} >
              <h5 className="xAxis-title">Hits Per Hour</h5>
              <div id="lineGraph"></div>
              <h5 className="xAxis-title">Hours Ago</h5>
            </Panel>
          </Col>

        </Row>

        <Row>
          <Col xs={12} md={4}>
            <Panel header={<h1>Server Status</h1>} id="yadda">
              <div>
                <div>SFO1: green (well under max)</div>
                <div>NYC2: yellow (close to max)</div>
                <div>HKG3: red (down)</div>
              </div>
            </Panel>
          </Col>
          <Col xs={12} md={8}>
            <Panel header={<h1>Relative Server Load</h1>} id="appGraph">
              {this.props.state.appServerTotals ? <BarGraph /> : <div>Loading...</div> }
            </Panel>
          </Col>
        </Row>

      </Grid>
    )
  }
}

MyApp = connect(state => ({ state: state }))(MyApp);
export default MyApp
