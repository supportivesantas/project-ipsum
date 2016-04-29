import React, { Component } from 'react';
import NavigationBar from './NavigationBar.js';
import { connect } from 'react-redux';
import { Grid } from 'react-bootstrap';
import { Link } from 'react-router';


// Prefered way for stateless components:
class App extends Component {

  render() {
    return (
      <div>
        {NavigationBar()}
        { this.props.children }
      </div>

    );
  }
}

const mapStateToProps = (state) => {
  return state;
};


export default connect(mapStateToProps)(App);
