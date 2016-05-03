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
      <div>
      DONALD TRUMP
      {this.props.selected.id}
      </div>
    );
  }
}


MainPageAppView = connect(state => ({ state: state }))(MainPageAppView);
export default MainPageAppView;
