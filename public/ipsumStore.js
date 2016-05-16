import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import userReducer from './reducers/userReducer.js';
import applicationReducer from './reducers/applicationReducer.js';
import serverReducer from './reducers/serverReducer.js';
import getDataReducer from './reducers/getDataReducer.js';
import logger from 'redux-logger';
import { routerReducer } from 'react-router-redux';
import lineGraphTitleReducer from './reducers/lineGraphTitleReducer.js';
import serverSelectReducer from './reducers/serverSelectReducer.js';
import changeAppServerTotalsReducer from './reducers/changeAppServerTotalsReducer.js';
import allAppSummariesReducer from './reducers/allAppSummariesReducer.js';
import appSelectionReducer from './reducers/appSelectionReducer.js';
import tokensReducer from './reducers/tokensReducer.js';
import myAppHistoryReducer from './reducers/myAppHistoryReducer.js';
import loadBalancersReducer from './reducers/loadBalancersReducer.js';
import imageListReducer from './reducers/imageListReducer.js';
import slaveServersReducer from './reducers/slaveServersReducer.js';

const getInitialState = () => {
  if (localStorage.getItem('state')) {
    const restoredState = JSON.parse(localStorage.getItem('state'));
    restoredState.routing = [];
    return restoredState;
  } else {
    return {
      routing: [],
      applications: [],
      allAppSummaries: [],
      user: {
        isLogged: 'false',
        handle: '',
      },
      servers: [],
      serverSelection: {},
      imageList: [],
      lineGraphTitle: [],
      graphData: [],
      tokens: [],
      loadBalancers: [],
      slaveServers: [],
    };
  }
};

// configure store with initial state and allow Redux Chrome extension to view store
export default function configureStore(browserHistory, initialState = getInitialState()) {
  const store = createStore(combineReducers({
    routing: routerReducer,
    applications: applicationReducer,
    user: userReducer,
    lineGraphTitle: lineGraphTitleReducer,
    serverSelection: serverSelectReducer,
    imageList: imageListReducer,
    allAppSummaries: allAppSummariesReducer,
    servers: serverReducer,
    graphData: getDataReducer,
    appSelection: appSelectionReducer,
    appServerTotals: changeAppServerTotalsReducer,
    tokens: tokensReducer,
    loadBalancers: loadBalancersReducer,
    myAppHistory: myAppHistoryReducer,
    slaveServers: slaveServersReducer,
  }), initialState, compose(
    window.devToolsExtension ? window.devToolsExtension() : f => f
    ));
  return store;
}


