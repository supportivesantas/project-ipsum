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
    this.render();
    renderChart('serverGraph', graphData[routeIndex].data);
    this.render();
  }

  render() {
    return (
      <Grid>
        <Row className="server-control-panel">
          <Col xs={12} md={12} lg={12}>
            <Panel header={<h1>Server Control Panel</h1>}>
              server info/control panel goes here
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
            <Panel header={<div>{this.graphTitle}</div>} >
              <h5 className="xAxis-title">Hits Per Hour</h5>
              <div id="serverGraph"></div>
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
