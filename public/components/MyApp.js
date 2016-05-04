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

  componentWillMount() {
    renderChart('serverGraph', this.props.state.graphData[0].data);
    setTimeout(() => {
      d3.selectAll('svg').remove();
      renderChart('serverGraph', this.props.state.graphData[0].data);
    }, 50);
  //   // this.props.dispatch(actions.ADD_WEEK_DATA());
  //   restHandler.post('/api/list_all_servers', {}, (err, res) => {
  //     const servers = JSON.parse(res.text).servers;
  //     const serversArr = [];
  //     for (let i = 0; i < servers.length; i++) {
  //       serversArr.push(actions.ADD_SERVER(servers[i].server_id, servers[i].ip, servers[i].platform,
  //         servers[i].name, servers[i].platformSpecific.status));
  //     }
  //     this.props.dispatch(actions.MASS_POPULATE_SERVERS(serversArr));
  //   });
  }

  // componentDidMount() {
  //   renderChart('serverGraph', this.props.state.graphData[0].data);
  //   setTimeout(() => {
  //     d3.selectAll('svg').remove();
  //     renderChart('serverGraph', this.props.state.graphData[0].data);
  //   }, 50);
  // }

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
            <Panel header={<div>{this.graphTitle}</div>} >
              <h5 className="xAxis-title">Hits Per Hour</h5>
              <div id="serverGraph"></div>
              <h5 className="xAxis-title">Hours Ago</h5>
            </Panel>
          </Col>

        </Row>

        <Row>
        <Col xs={12} md={12}>
          <Panel header={<div>{this.graphTitle}</div>} id="serverGraph"></Panel>
        </Col>
        </Row>
      </Grid>
    );
  }
}

MyServer = connect(state => ({ state: state }))(MyServer);
export default MyServer;
