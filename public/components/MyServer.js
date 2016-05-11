import React from 'react';
import actions from '../actions/ipsumActions.js';
import { connect } from 'react-redux';
import { renderChart } from '../D3graphTemplate';
import { Panel, Grid, Row, Col, Clearfix, PageHeader, ListGroup, ListGroupItem } from 'react-bootstrap';
import request from '../util/restHelpers.js';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';


class MyServer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  updateGraphTitle(clickedRoute) {
    console.log(clickedRoute);
    this.graphTitle = clickedRoute;
    return this.graphTitle;
  }

  componentDidMount() {
    this.props.dispatch(actions.ADD_LINE_GRAPH_TITLE('/Total'));
    var servId = this.props.state.serverSelection.id;
    request.post('/getStats/server',
      {serverId: servId, hours: 24}, //TODO figure out how to keep track of desired hours, have user settings/config in store?
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

          <Col xs={12} lg={12} >
            <h2>What{'\''}s Happening</h2>
            <Panel header={<div>Routes</div>} >
              <Grid fluid>
              <Row>
              <Col xs={4} lg={4}>
              <ListGroup className='server-route-list'>
               {this.props.state.graphData.map(graph =>
                  <ListGroupItem className='routePanel' onClick={this.updateGraph.bind(this, graph)}>
                    <p>/{graph.route}</p>
                  </ListGroupItem>
                )}
             </ListGroup>
          </Col>
          <Col xs={12} lg={8}>
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
      </Grid>
    );
  }
}

MyServer = connect(state => ({ state: state }))(MyServer);
export default MyServer;
