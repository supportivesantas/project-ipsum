import React from 'react';
import { render } from 'react-dom';
import App from './components/app.js';
import Login from './components/Login.js';
import About from './components/About.js';
import MyApp from './components/MyApp.js';
import MyServer from './components/MyServer.js';
import AllServers from './components/AllServers.js';
import { Provider } from 'react-redux';
import configureStore from './ipsumStore.js';
import { browserHistory, Router, Route, IndexRoute } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import MainPage from './components/MainPage.js';
import actions from './actions/ipsumActions.js';
import auth from './util/authHelpers.js';
import tokens from './components/tokens.js';
import addLoadBalancer from './components/AddLoadBalancer.js';
import resthandler from './util/restHelpers.js';
const store = configureStore();
const history = syncHistoryWithStore(browserHistory, store);

const logout = () => {
  console.log('LO hit');
  auth.logout();
  store.dispatch(actions.USER_RESET());
  window.location.href = '/login';
};

const restoreSession = () => {
  return new Promise((resolve, reject) => {
    resthandler.get('/user/sessionreload', (err, res) => {
      if (err) {
        console.log(err);
      } else {
        resolve(res.text);
      }
    });
  });
};

store.subscribe(() => {
  const state = store.getState();
  localStorage.setItem('state', JSON.stringify(state));
});

restoreSession()
  .then(() => {
    render(
      <Provider store={store}>
        <Router history={history}>

          <Route path="/login" component={Login} />
          <Route path="/about" component={About} />
          <Route path="/logout" onEnter={logout} />
          <Route path="/auth/github/callback" />

          <Route path="/" component={App} onEnter={auth.requireAuth} >
            <IndexRoute component={MainPage} onEnter={auth.requireAuth} />
            <Route path="/allServers" component={AllServers} onEnter={auth.requireAuth} />
            <Route path="/myServer" component={MyServer} onEnter={auth.requireAuth} />
            <Route path="/myApp" component={MyApp} onEnter={auth.requireAuth} />
            <Route path="/tokens" component={tokens} onEnter={auth.requireAuth} />
            <Route path="/loadBalancer" component={addLoadBalancer} onEnter={auth.requireAuth} />
          </Route>

        </Router>
      </Provider>,
      document.getElementById('app')
    );
  });


