import React from 'react';
import actions from '../actions/ipsumActions.js';
import { connect } from 'react-redux';
import maps from '../mappingFunctions.js';


class AllApps extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  addApp(e) {
    e.preventDefault();
    this.props.dispatch(actions.ADD_APPLICATION('sdasdasdasdasd'));
  }

  render() {
    return (
      <div> THIS IS OUR ALL APPS PAGE.
      List of all apps goes here.
      <button type="submit" onClick={this.addApp.bind(this)} > Add app </button>

      </div>
    );
  }
}


AllApps = connect(state => ({ applications: state.applications }))(AllApps);
export default AllApps;
