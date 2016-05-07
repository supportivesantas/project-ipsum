import React from 'react';
import actions from '../actions/ipsumActions.js';
import { connect } from 'react-redux';
import { renderChart } from '../D3graphTemplate';
import { Panel, Grid, Row, Col, Clearfix } from 'react-bootstrap';
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
        <Row className="server-control-panel">
          <Col xs={12} md={12} lg={12}>
            <Panel header={<h1>Server Control Panel</h1>}>
              <span style={{textDecoration:'underline'}}>Server:  </span> {this.props.state.serverSelection.hostname}<br/>
              <span style={{textDecoration:'underline'}}>IP:  </span> {this.props.state.serverSelection.ip}<br/>
              <span style={{textDecoration:'underline'}}>Status:  </span> {this.props.state.serverSelection.active}<br/>
              <span style={{textDecoration:'underline'}}>Platform:  </span> {this.props.state.serverSelection.platform}<br/>
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
      </Grid>
    );
  }
}

MyServer = connect(state => ({ state: state }))(MyServer);
export default MyServer;
