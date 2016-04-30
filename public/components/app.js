import React, { Component } from 'react';
import NavigationBar from './NavigationBar.js';
import { Grid } from 'react-bootstrap';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import maps from '../mappingFunctions.js';
import Login from './Login.js';


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
// const mapStateToProps = (state) => {
//   return { state: state };
// };
App = connect()(App);
export default App;
// export default App;
