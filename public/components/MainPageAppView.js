import React from 'react';
import { browserHistory } from 'react-router';
import actions from '../actions/ipsumActions.js';
import { connect } from 'react-redux';
import maps from '../mappingFunctions.js';
import { Button, ButtonToolbar, Panel, Col } from 'react-bootstrap';
import _ from 'underscore';

class MainPageAppView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  getNumServers(id) {
    const appServers = _.filter(this.props.state.servers, (item) => {
      return _.pluck(item.apps, 0).indexOf(id) !== -1;
    });
    const activeServers = _.filter(appServers, (item) => {
      return item.active === 'active';
    });
    return { active: activeServers, total: appServers };
  }

  generateHeader(id) {
    var ratio = this.getNumServers(id);
    return (
        <div onClick={this.goToApp.bind(this)} className="AppViewHeaderText">
            {this.props.selected.appname} <span className="pull-right">{ratio.active.length}/{ratio.total.length} active</span>
        </div>
    );
  }

  generateAppStats(id) {
    var app = this.props.state.allAppSummaries[id];
    return (
      <div>
        <h4>Date: {app.data} (just display in chart)</h4>
        <h4>Total Hits: {app.totalHits} (just display in chart)</h4>
        <h4>Total Routes: {app.totalRoutes} </h4>
      </div>
    )
  }

  goToApp() {
    this.props.dispatch(actions.ADD_APP_SELECTION(this.props.selected));
    browserHistory.push('/myApp');
  }

  render() {
    return (
      <Col xs={12} sm={6} md={6}>
        <div className="MainPageAppView">
          <Panel header={this.generateHeader(this.props.selected.id)}>
            <Panel>
              GRAPH GOES HERE
            </Panel>
            {this.generateAppStats(this.props.selected.id)}
          </Panel>
        </div>
      </Col>
    );
  }
}

MainPageAppView = connect(state => ({ state: state }))(MainPageAppView);
export default MainPageAppView;
