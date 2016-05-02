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

const store = configureStore();
const history = syncHistoryWithStore(browserHistory, store);

// GET ASYNC DATA HERE BEFORE RENDER, THEN CALL RENDER

render(
  <Provider store={store}>
    <Router history={history}>

      <Route path="/login" component={Login} />

      <Route path="/" component={App} >
        <IndexRoute component={MainPage} />
        <Route path="/allApps" component={AllApps} />
        <Route path="/allServers" component={AllServers} />
        <Route path="/myServer" component={MyServer} />
        <Route path="/myApp" component={MyApp} />
      </Route>

    </Router>
  </Provider>,
  document.getElementById('app')
);



