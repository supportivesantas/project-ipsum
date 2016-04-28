import React from 'react';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: false,
    };
  }

  handleSubmit(e) {
    e.preventDefault();
  }

  render() {
    return (
      <div id="loginFormWrapper">
        <h2>Please login</h2>


        <button type="submit" block>Login with Github</button>

        {this.state.error && (
          <p>You have supplied invalid login information. Please Try Again.</p>
        )}

      </div>
    );
  }
}


module.exports = Login;
