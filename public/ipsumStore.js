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
        isLogged: false,
        handle: '',
      },
      servers: [],
      graphData: [
        {route: "Total",
          data: [{ time: 0, hits: 5}, { time: 0+1, hits: 4}, { time: 1+1, hits: 10}, { time: 2+1, hits: 2}, { time:3 +1, hits: 14}, { time:4 +1, hits: 8}, { time: 5+1, hits: 12}, { time: 6+1, hits: 4}, { time: 7+1, hits: 10}, { time: 8+1, hits: 2}, { time:9 +1, hits: 14}, { time:10+1 , hits: 8}, { time: 1+11, hits: 12}]
        },
        {
          "route": "something",
          "data": [{ time: 0, hits: 0}, { time: 0+1, hits: 0}, { time: 1+1, hits: 0}, { time: 2+1, hits: 0}, { time:3 +1, hits: 0}, { time:4 +1, hits: 0}, { time: 5+1, hits: 0}]
        },
        {
          "route": "swwweeettt",
          "data": [{ time: 0, hits: 5}, { time: 0+1, hits: 4}, { time: 1+1, hits: 10}, { time: 2+1, hits: 2}, { time:3 +1, hits: 14}, { time:4 +1, hits: 8}, { time: 5+1, hits: 12}, { time: 6+1, hits: 4}, { time: 7+1, hits: 10}, { time: 8+1, hits: 2}, { time:9 +1, hits: 14}, { time:10+1 , hits: 8}, { time: 1+11, hits: 12}, { time: 13, hits: 4}, { time: 14, hits: 10}, { time: 15, hits: 2}, { time:16, hits: 14}, { time:17, hits: 8}, { time: 18, hits: 12}, { time: 19, hits: 4}, { time: 20, hits: 10}, { time: 21, hits: 2}, { time:22, hits: 14}, { time:23 , hits: 8}, { time: 24, hits: 12}]
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

