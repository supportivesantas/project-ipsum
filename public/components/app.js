import React, { Component } from 'react';
import NavigationBar from './NavigationBar.js';
import { Grid } from 'react-bootstrap';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import maps from '../mappingFunctions.js';

// Prefered way for stateless components:
class App extends Component {
  render() {
    return (
      <div>
        {NavigationBar()}
        {this.props.children}
      </div>

    );
  }
}


export default connect(maps.mapStateToProps)(App);
