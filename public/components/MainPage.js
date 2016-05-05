import React from 'react';
import actions from '../actions/ipsumActions.js';
import { connect } from 'react-redux';
import maps from '../mappingFunctions.js';
import restHandler from '../util/restHelpers.js';
import MainPageAppView from './MainPageAppView.js';
import {Grid, Row} from 'react-bootstrap';

class MainPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentWillMount() {
    restHandler.get('/user/init', (err, res) => {
      // const servers = JSON.parse(res.text).servers;
      // const serversArr = [];
      // for (let i = 0; i < servers.length; i++) {
      //   serversArr.push(actions.ADD_SERVER(servers[i].server_id, servers[i].ip,
      //     servers[i].platform, servers[i].name, servers[i].platformSpecific.status));
      // }
      // this.props.dispatch(actions.MASS_POPULATE_SERVERS(serversArr));
      const data = JSON.parse(res.text);
      console.log(data);
      this.props.dispatch(actions.MASS_POPULATE_APPS(data.apps));
      this.props.dispatch(actions.MASS_POPULATE_SERVERS(data.servers));
    });
  }

  appList() {
    return this.props.state.applications.map((app, index) => {
      return (
        <MainPageAppView selected={app} />
      );
    });
  }

  render() {
    return (
      <Grid><Row>
        {this.appList()}
      </Row></Grid>
    );
  }
}


MainPage = connect(state => ({ state: state }))(MainPage);
export default MainPage;
