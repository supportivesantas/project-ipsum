import React from 'react';
import Redux from 'redux';
import { render } from 'react-dom';
import App from './components/App.js';
import Login from './components/Login.js';
import { Provider } from 'react-redux';
import configureStore from './ipsumStore.js';
import { hashHistory, Router, Route, Link, IndexRoute } from 'react-router';
import { syncHistoryWithStore, routerReducer } from 'react-router-redux';
import MainPage from './components/MainPage.js';

const store = configureStore();
const history = syncHistoryWithStore(hashHistory, store);

render(
  <Provider store={store}>
    <Router history={history}>

      <Route path="/login" component={Login} />

      <Route path="/" component={App} >
        <IndexRoute component={MainPage} />
      </Route>

    </Router>
  </Provider>,
  document.getElementById('app')
);
