import { applyMiddleware, compose, createStore } from 'redux';
import reducers from './reducers/ipsumReducers.js';
import logger from 'redux-logger';


const middleware = [logger];
// configure store with initial state and allow Redux Chrome extension to view store
export default function configureStore(initialState = { applications: [] }) {
  const store = createStore(reducers, initialState, compose(
    applyMiddleware(...middleware),
    window.devToolsExtension ? window.devToolsExtension() : f => f
    ));
  return store;
}

