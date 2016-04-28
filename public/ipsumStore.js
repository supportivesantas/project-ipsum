import { createStore } from 'redux';
import reducers from './reducers/ipsumReducers.js';


// configure store with initial state and allow Redux Chrome extension to view store
export default function configureStore(initialState = { applications: [] }) {
  const store = createStore(reducers, initialState,
    window.devToolsExtension ? window.devToolsExtension() : undefined
    );
  return store;
}
