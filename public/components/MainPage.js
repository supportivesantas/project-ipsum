import React from 'react';
import actions from '../actions/ipsumActions.js';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import maps from '../mappingFunctions.js';
import restHandler from '../util/restHelpers.js';
import MainPageAppView from './MainPageAppView.js';
import { Grid, Row, Col, PageHeader } from 'react-bootstrap';
import {Link} from 'react-router';

class MainPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentWillMount() {
    // Get app and server data and place in store
    restHandler.get('/user/init', (err, res) => {
      if (res.status !== 401) {
        const data = JSON.parse(res.text);
        if (data.apps) {this.props.dispatch(actions.MASS_POPULATE_APPS(data.apps));}
        if (data.servers) {this.props.dispatch(actions.MASS_POPULATE_SERVERS(data.servers));}
        if (data.userhandle) {this.props.dispatch(actions.POPULATE_USER_DATA(data.userhandle));}
      } else {
        browserHistory.push('/logout');
      }
    });
  }

  appList() {
    // Create a view for each app
    if (this.props.state.applications.length) {
      return this.props.state.applications.map((app, index) => {
        return (
          <MainPageAppView key={index} selected={app} />
        );
      });
    } else {
      return (
      <div>
        <PageHeader>Uh oh! <small>no apps to display</small></PageHeader>
        <p>Visit the <a href="https://github.com/supportivesantas/project-ipsum">repo</a> to get started.</p>
      </div>
      )
    }
  }

  render() {
    return (

      <Grid key={1}><Row><Col md={12}>
        {this.appList()}
      </Col></Row></Grid>
    
    );
  }
}


MainPage = connect(state => ({ state: state }))(MainPage);
export default MainPage;
