import React from 'react';
import actions from '../actions/ipsumActions.js';
import { connect } from 'react-redux';
import { renderChart } from '../D3graphTemplate';
import { Panel, Grid, Row, Col, Clearfix } from 'react-bootstrap';
import request from '../util/restHelpers';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import BarGraph from './BarGraph'

class MyApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount(){
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
      });
      // this.setState({data: output});
      this.props.dispatch(actions.CHANGE_APP_SERVER_TOTALS(output))
    });
  }

  render() {
    return (
      <Grid>
        <Row className="app-control-panel">
          <Col xs={12} md={12}>
            <h3>{this.props.state.currentAppname || 'Test App Name'}</h3>
          </Col>
        </Row>

        <Row className="app-control-panel">
          <Col xs={12} md={12}>
            <Panel header={<h1>Application Control Panel</h1>}>
            <i>Note: Route traffic info aggregates across all servers running the app</i> <br/>
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