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
    this.graphTitle = this.graphTitle || '/Total';
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
    this.graphTitle = "/" + graph.route;
    d3.selectAll('svg').remove();
    var routeIndex;
    for (var i = 0; i < graphData.length; i++) {
      if (graphData[i].route === graph.route) {
        routeIndex = i;
      }
    }
    renderChart('serverGraph', graphData[routeIndex].data);
    console.log(this.graphTitle)
  }

  render() {
    return (
      <div>
        <Panel header={<h1>Control Panel</h1>}>
          server info/control panel goes here
        </Panel>

        <div class='serverStatContainer'>
          <Col xs={6} md={4} >
            <Panel header={<div>Routes</div>} >
             {this.props.state.graphData.map(graph =>
                <Panel onClick={this.updateGraph.bind(this, graph)}>
                  <h3>/{graph.route}</h3>
                </Panel>
              )}
           </Panel>
          </Col>
          <Col xs={12} md={8}>
            <Panel header={<div>{this.graphTitle}</div>} id="serverGraph"></Panel>
          </Col>

        </div>
      </div>
    );
  }
}

MyServer = connect(state => ({ state: state }))(MyServer);
export default MyServer;
