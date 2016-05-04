import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import userReducer from './reducers/userReducer.js';
import applicationReducer from './reducers/applicationReducer.js';
import serverReducer from './reducers/serverReducer.js';
import getDataReducer from './reducers/getDataReducer.js';
import weekDataReducer from './reducers/weekDataReducer.js';
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
        isLogged: 'false',
        handle: '',
      },
      servers: [],
      graphData: [
        {route: "init",
          data: [{ time: 0, hits: 0}] //quick fix for async data retrival, probs a better way
        },
      ],
      weekData: [] /* an array of integers containing the number 
                    of hits over one week for one app (across 
                    all serves for all relevantrelated routes) */
    };
  }
};

// configure store with initial state and allow Redux Chrome extension to view store
export default function configureStore(browserHistory, initialState = getInitialState()) {
  const store = createStore(combineReducers({
    routing: routerReducer,
    applications: applicationReducer,
    user: userReducer,
    servers: serverReducer,
    graphData: getDataReducer,
    weekData: weekDataReducer
  }), initialState, compose(
    applyMiddleware(...middleware),
    window.devToolsExtension ? window.devToolsExtension() : f => f
    ));
  return store;
}

