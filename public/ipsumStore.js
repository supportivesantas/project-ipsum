import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import reducers from './reducers/ipsumReducers.js';
import logger from 'redux-logger';
import { routerReducer } from 'react-router-redux';


const middleware = [logger()];
// const combinedReducers = combineReducers({ ...reducers, routing: routerReducer });

// configure store with initial state and allow Redux Chrome extension to view store
export default function configureStore(initialState = { applications: [{ id: 0, payload: 'QQQQQQQQQQ' }] }) {
  const store = createStore(combineReducers(...reducers, {
    routing: routerReducer,
  }), initialState, compose(
    applyMiddleware(...middleware),
    window.devToolsExtension ? window.devToolsExtension() : f => f
    ));
  return store;
}

