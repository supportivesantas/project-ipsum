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
    this.graphTitle = '/Total';
    this.state = {
    };
  }

  componentDidMount() {
    renderChart('serverGraph', this.props.state.graphData[0].data);
    setTimeout(() => {
      d3.selectAll('svg').remove();
      renderChart('serverGraph', this.props.state.graphData[0].data);
    }, 50);
  }

  updateGraph(graph) {
    var graphData = this.props.state.graphData;
    this.graphTitle = "/" + graph.route; //Fix to Update TITLE when clicking a new route
    d3.selectAll('svg').remove();
    var routeIndex;
    for (var i = 0; i < graphData.length; i++) {
      if (graphData[i].route === graph.route) {
        routeIndex = i;
      }
    }
    renderChart('serverGraph', graphData[routeIndex].data);
  }

  render() {
    return (
      <Grid>
        <Row className="server-control-panel">
          <Panel header={<h1>Server Control Panel</h1>}>
            server info/control panel goes here
          </Panel>
        </Row>

        <Row class='serverStatContainer'>
          <Col xs={12} md={3} >
            <Panel header={<div>Routes</div>} >
             {this.props.state.graphData.map(graph =>
                <Panel onClick={this.updateGraph.bind(this, graph)}>
                  <p>/{graph.route}</p>
                </Panel>
              )}
           </Panel>
          </Col>
          <Col xs={12} md={9}>
            <Panel header={<div>{this.graphTitle}</div>} id="serverGraph"></Panel>
          </Col>

        </Row>
      </Grid>
    );
  }
}

MyServer = connect(state => ({ state: state }))(MyServer);
export default MyServer;
