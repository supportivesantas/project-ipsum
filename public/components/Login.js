import React from 'react';
import actions from '../actions/ipsumActions.js';
// import { connect } from 'react-redux';

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

        {this.state.error && (
          <p>You have supplied invalid login information. Please Try Again.</p>
        )}

      </div>
    );
  }
}


module.exports = Login;
