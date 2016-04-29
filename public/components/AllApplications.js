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

  render() {
    return (
      <div> THIS IS OUR ALL APPS PAGE.
      List of all apps goes here.
      </div>
    );
  }
}


export default connect(maps.mapStateToProps)(AllApps);
