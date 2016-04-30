import React from 'react';
import actions from '../actions/ipsumActions.js';
import { connect } from 'react-redux';
import maps from '../mappingFunctions.js';

class Login extends React.Component {

  handleSubmit(e) {
    e.preventDefault();
    // do login with github here
    this.props.dispatch(actions.POPULATE_USER_DATA('m@m.com', 'jnasddassd'));
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
        {this.props.state.user.handle}
      </div>
    );
  }
}

Login = connect(state => ({ state: state }))(Login);
export default Login;
