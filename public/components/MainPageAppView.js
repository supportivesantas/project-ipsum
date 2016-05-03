import React from 'react';
import actions from '../actions/ipsumActions.js';
import { connect } from 'react-redux';
import maps from '../mappingFunctions.js';

class MainPageAppView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <div className="MainPageAppView">
        <div className="AppViewHeaderText">DONALD TRUMP - {this.props.selected.id} - 3/5 </div>
        INSERT GRAPH HERE
      </div>
    );
  }
}


MainPageAppView = connect(state => ({ state: state }))(MainPageAppView);
export default MainPageAppView;
