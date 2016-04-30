import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import userReducer from './reducers/userReducer.js';
import applicationReducer from './reducers/applicationReducer.js';
import serverReducer from './reducers/serverReducer.js';
import logger from 'redux-logger';
import { routerReducer } from 'react-router-redux';


const middleware = [logger()];
const init = {
  routing: [],
  applications: [],
  user: {
    email: 'QQ@QQ.com',
    handle: 'QQQQQQQ',
  },
  servers: [{ id: 0, ip: '1.1.1.1', platform: 'Digital Ocean', app: 'someApp', active: 'True' },
  { id: 1, ip: '4.3.2.1', platform: 'Heroku', app: 'Things', active: 'False' }],
};

// configure store with initial state and allow Redux Chrome extension to view store
export default function configureStore(browserHistory, initialState = init) {
  const store = createStore(combineReducers({
    routing: routerReducer,
    applications: applicationReducer,
    user: userReducer,
    servers: serverReducer,
  }), initialState, compose(
    applyMiddleware(...middleware),
    window.devToolsExtension ? window.devToolsExtension() : f => f
    ));
  return store;
}

