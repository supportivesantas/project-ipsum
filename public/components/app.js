import React, { Component } from 'react';
import Login from './Login.js';
import { connect } from 'react-redux';

// Prefered way for stateless components:
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }
  render() {
    return (
      <div>
        SUPER COOL AWESOME MEGA FANTASTIC INCREDIBLE APP!!!!!!!
        <Login dispatch={this.props.dispatch} apps={this.props.applications} />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return state;
};


export default connect(mapStateToProps)(App);
