import React from 'react';
import actions from '../actions/ipsumActions.js';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import request from '../util/restHelpers';
import _ from 'underscore';
import { Panel, Grid, Row, Col, Clearfix, PageHeader, ListGroup, ListGroupItem } from 'react-bootstrap';
import Dropdown from 'react-select';
import barGraph from './BarGraph';

class MyAppHistory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      routes: [],
      servers: []
    };
  }

  componentDidMount(){
    request.post('/getStats/serverTotalsForApp', {
      userid: 1,
      appid: 1,
      days: 1
    }, (err, resp) => {
      var data = JSON.parse(resp.text);
      this.props.dispatch(actions.ADD_MYAPP_HISTORY(data));
      historyGraph.render('historyGraph', this.props.state.myAppHistory);
    });
  }



  render() {
    return (
      <Row>
      <Col xs={12} md={12}>
      <h2>Look back</h2>
      <Panel header={<h1>Selected History</h1>}>
        <Grid fluid>
        <Row>
          <Col xs={12} md={4}>
            Selection stuff
          </Col>
          <Col xs={12} md={8}>
            <div className='historyGraph'><svg></svg></div>
          </Col>
        </Row>
        </Grid>
      </Panel>
      </Col>
      </Row>
    )
  }
}

MyAppHistory = connect(state => ({ state: state }))(MyAppHistory);
export default MyAppHistory