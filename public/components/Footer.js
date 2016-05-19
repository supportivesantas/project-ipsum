import React from 'react';
import {Grid, Row, Col} from 'react-bootstrap';

var handleSubmit = (e) => {
  e.preventDefault();
  // do login with github here
  window.location.href = '/auth/github';
}

class Footer extends React.Component {

  render() {
    return (

    <div className='footer'>
    <div className='footer-row-brand'><h3><a href="/">DJ Depoy</a></h3></div>
    <div className='footer-row'>
      <div className='footer-col'>
      <p>&copy; 2016 DJ Deploy</p> 
      </div>
      <div className='footer-col'>
      <p><a href="https://github.com/supportivesantas/project-ipsum">Github Repo</a></p>
      <p><a href="https://www.npmjs.com/package/lib-dj-deploy">DJ Deploy Middleware</a></p>
      </div>
      <div className='footer-col'>
      <p><a href="/">Home</a></p>
      <p><a href="/about">About</a></p>
      <p><a href="#" onClick={handleSubmit.bind(this)}>Login</a></p>
      </div>
    </div>
    </div>
      )
  }
}

export default Footer