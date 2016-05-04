import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import userReducer from './reducers/userReducer.js';
import applicationReducer from './reducers/applicationReducer.js';
import serverReducer from './reducers/serverReducer.js';
import getDataReducer from './reducers/getDataReducer.js';
import logger from 'redux-logger';
import { routerReducer } from 'react-router-redux';


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
      user: {
        email: 'QQ@QQ.com',
        handle: 'QQQQQQQ',
      },
      servers: [],
      graphData: [
        {route: "init",
          data: [{ time: 0, hits: 0}] //quick fix for async data retrival, probs a better way
        },
      ],
    };
  }
};

// configure store with initial state and allow Redux Chrome extension to view store
export default function configureStore(browserHistory, initialState = getInitialState()) {
  console.log(initialState);
  const store = createStore(combineReducers({
    routing: routerReducer,
    applications: applicationReducer,
    user: userReducer,
    servers: serverReducer,
    graphData: getDataReducer,
  }), initialState, compose(
    applyMiddleware(...middleware),
    window.devToolsExtension ? window.devToolsExtension() : f => f
    ));
  return store;
}

