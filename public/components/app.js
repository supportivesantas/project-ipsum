import React, { Component } from 'react';
import NavigationBar from './NavigationBar.js';
import { Grid } from 'react-bootstrap';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import maps from '../mappingFunctions.js';
import restHandler from '../util/restHelpers.js';
import actions from '../actions/ipsumActions.js';
import style from '../styles/styles.js';

class App extends Component {

  render() {
    return (
      <div style={style.backgroundDark}>
        {NavigationBar()}
        {this.props.children}
      </div>


    );
  }
}

App = connect(state => ({ state: state }))(App);
export default App;
