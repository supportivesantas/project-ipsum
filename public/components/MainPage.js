import React from 'react';
import actions from '../actions/ipsumActions.js';
import { connect } from 'react-redux';
import maps from '../mappingFunctions.js';

class MainPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }


  render() {
    return (
      <div> THIS IS OUR MAIN PAGE.
      COOL STUFF WILL GO HERE!!!!
      </div>
    );
  }
}


MainPage = connect(state => ({ state: state }))(MainPage);
export default MainPage;
