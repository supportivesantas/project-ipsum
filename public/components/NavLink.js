import React from 'react';
import { Link } from 'react-router';
import style from '../styles/styles.js';

export default class NavLink extends React.Component {
  render() {
    return <Link {...this.props} activeClassName="active" />;
  }
}
