import React from 'react';
import { browserHistory } from 'react-router';
import actions from '../actions/ipsumActions.js';
import { connect } from 'react-redux';
import maps from '../mappingFunctions.js';
import { Button, ButtonToolbar, Panel, Col } from 'react-bootstrap';
import barGraph from './AllAppsBarGraph';
import restHandler from '../util/restHelpers.js';
import _ from 'underscore';

class MainPageAppView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      resizefunc: null
    };
  }

  componentDidMount(id) {
    restHandler.post('getStats/allAppSummaries', {}, (err, res) => {
      if (res.status !== 401) {
        this.props.dispatch(actions.ADD_ALL_APP_SUMMARIES(res.body));
        var apps = this.props.state.allAppSummaries || {};
        var id = this.props.selected.id;
        var app;
        for (var i = 0; i < apps.length; i++) {
          if (+apps[i].appid === id) {
            app = apps[i];
            break;
          }
        }
        if (app && app.data) {
          barGraph("Graph" + id, _.sortBy(app.data, (obj) => {
            return obj.date;
          }));
        }  
      } else {
        browserHistory.push('/login');
      }
    });
    this.setState({ resizefunc: this.resizedb() }, () => {
      window.addEventListener('resize', this.state.resizefunc);
    });
  }

  resizedb() {
    var resize = function () {
      var apps = this.props.state.allAppSummaries || {};
      var id = this.props.selected.id.toString();
      var app = _.findWhere(apps, {appid: id});

      if (app && app.data) {
        barGraph("Graph" + id, _.sortBy(app.data, (obj) => {
          return obj.date;
        }));
      }
    };
    return _.debounce(resize.bind(this), 500);
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.state.resizefunc);
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
    var apps = this.props.state.allAppSummaries || {};
    var app;
    for (var i = 0; i < apps.length; i++) {
      if (+apps[i].appid === id) {
        app = apps[i];
        break;
      }
    }
    app = app || {};
    return (
      <div>
        <h4>Total Routes Monitored: {app.totalRoute}</h4>
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
            <h4 style={{"textAlign":"center"}}>Load over the last week</h4>
            <div id={"Graph" + this.props.selected.id.toString()}>
            </div>
            {this.generateAppStats(this.props.selected.id)}
          </Panel>
        </div>
      </Col>
    );
  }
}

MainPageAppView = connect(state => ({ state: state }))(MainPageAppView);
export default MainPageAppView;
