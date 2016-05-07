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

const middleware = [logger()];
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
      lineGraphTitle: [],
      graphData: []
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
    allAppSummaries: allAppSummariesReducer,
    servers: serverReducer,
    graphData: getDataReducer,
    graphData: getDataReducer,
    appSelection: appSelectionReducer,
    appServerTotals: changeAppServerTotalsReducer
  }), initialState, compose(
    applyMiddleware(...middleware),
    window.devToolsExtension ? window.devToolsExtension() : f => f
    ));
  return store;
}


