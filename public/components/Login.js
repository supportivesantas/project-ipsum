import React from 'react';
import actions from '../actions/ipsumActions.js';
import { connect } from 'react-redux';
import maps from '../mappingFunctions.js';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: false,
    };
  }

  handleSubmit(e) {
    e.preventDefault();
    // do login with github here
  }

  render() {
    return (
      <div id="loginFormWrapper">
        <h2>Please login</h2>


        <button
          type="submit"
          onClick={this.handleSubmit.bind(this)}
          block
        >Login with Github</button>

      </div>
    );
  }
}


export default connect(maps.mapStateToProps)(Login);
