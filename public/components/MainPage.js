import React from 'react';
import actions from '../actions/ipsumActions.js';
import { connect } from 'react-redux';
import maps from '../mappingFunctions.js';
import restHandler from '../util/restHelpers.js';
import MainPageAppView from './MainPageAppView.js';
import { Grid, Row } from 'react-bootstrap';

class MainPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentWillMount() {
    // Get app and server data and place in store
    restHandler.get('/user/init', (err, res) => {
      const data = JSON.parse(res.text);
      console.log(data);
      this.props.dispatch(actions.MASS_POPULATE_APPS(data.apps));
      this.props.dispatch(actions.MASS_POPULATE_SERVERS(data.servers));
    });

    restHandler.post('getStats/allAppSummaries', {}, (err, res) => {
      this.props.dispatch(actions.ADD_ALL_APP_SUMMARIES(res.body));
    });
  }

  appList() {
    // Create a view for each app
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
