import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import reducers from './reducers/ipsumReducers.js';
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
  servers: [{ ip: '1.1.1.1', platform: 'Digital Ocean', app: 'someApp' },
  { ip: '4.3.2.1', platform: 'Heroku', app: 'Things' }],
};
// const combinedReducers = combineReducers({ ...reducers, routing: routerReducer });

// configure store with initial state and allow Redux Chrome extension to view store
export default function configureStore(browserHistory, initialState = init) {
  const store = createStore(combineReducers(...reducers, {
    routing: routerReducer,
    applications: reducers,
    user: reducers,
    servers: reducers,
  }), initialState, compose(
    applyMiddleware(...middleware),
    window.devToolsExtension ? window.devToolsExtension() : f => f
    ));
  return store;
}

