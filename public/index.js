import React from 'react';
import { render } from 'react-dom';
import App from './components/app.js';
import Login from './components/Login.js';
import MyApp from './components/MyApp.js';
import MyServer from './components/MyServer.js';
import AllApps from './components/AllApplications.js';
import AllServers from './components/AllServers.js';
import { Provider } from 'react-redux';
import configureStore from './ipsumStore.js';
import { browserHistory, Router, Route, IndexRoute } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import MainPage from './components/MainPage.js';
import actions from './actions/ipsumActions.js';
import auth from './util/authHelpers.js';
import tokens from './components/tokens.js';

const store = configureStore();
const history = syncHistoryWithStore(browserHistory, store);

// GET ASYNC DATA HERE BEFORE RENDER, THEN CALL RENDER

const logout = () => {
  console.log('LO hit');
  auth.logout();
  store.dispatch(actions.USER_RESET());
  window.location.href = '/login';
};
store.subscribe(() => {
  const state = store.getState();
  localStorage.setItem('state', JSON.stringify(state));
});
render(
  <Provider store={store}>
    <Router history={history}>

      <Route path="/login" component={Login} />
      <Route path="/logout" onEnter={logout} />
      <Route path="/auth/github/callback" />

      <Route path="/" component={App} onEnter={auth.requireAuth} >
        <IndexRoute component={MainPage} onEnter={auth.requireAuth} />
        <Route path="/allApps" component={AllApps} onEnter={auth.requireAuth} />
        <Route path="/allServers" component={AllServers} onEnter={auth.requireAuth} />
        <Route path="/myServer" component={MyServer} onEnter={auth.requireAuth} />
        <Route path="/myApp" component={MyApp} onEnter={auth.requireAuth} />
        <Route path="/tokens" component={tokens} onEnter={auth.requireAuth} />
      </Route>

    </Router>
  </Provider>,
  document.getElementById('app')
);

