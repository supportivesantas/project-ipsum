import React from 'react';
import actions from '../actions/ipsumActions.js';
import { connect } from 'react-redux';
import { addData, renderChart } from '../D3graphTemplate';
import { Grid, Row, Col, Clearfix } from 'react-bootstrap';
// import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';


class MyServer extends React.Component {
  constructor(props) {
    super(props);
    this.setInt = null;
    this.state = {
    };
  }

  componentDidMount() {
    renderChart('serverGraph', this.props.state.graphData[0].data);
    // this.props.state.graphData.map(graph =>
    //   renderChart(graph.route)
    // );

    // var that = this;
    // this.setInt = setInterval(function() {
    //   addData();
    //   that.props.state.graphData.map(graph => {
    //     renderChart(graph.route);
    //   });
    // }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.setInt);
  }

  updateGraph(graph) {
    var graphData = this.props.state.graphData;
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
      <div>
        <div>
          server info/control panel goes here
        </div>

        <div class='serverStatContainer'>
          <Col xs={6} md={4} style={{backgroundColor: 'red'}} >
           {this.props.state.graphData.map(graph =>
              <div onClick={this.updateGraph.bind(this, graph)}>
                <h3>/{graph.route}</h3>
              </div>
            )}
          </Col>
          <Col xs={12} md={8}>
            <div id="serverGraph"></div>
          </Col>

        </div>
      </div>
    );
  }
}

MyServer = connect(state => ({ state: state }))(MyServer);
export default MyServer;
