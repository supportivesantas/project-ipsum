import React from 'react';
import Redux from 'redux';
import { render } from 'react-dom';
import App from './components/App.js';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import actions from './actions/ipsumActions.js';
import reducers from './reducers/ipsumReducers.js';
import Login from './components/Login.js';


// configure store with initial state and allow Redux Chrome extension to view store
const configureStore = (initialState) => {
  const store = createStore(reducers, initialState,
    window.devToolsExtension ? window.devToolsExtension() : undefined
    );
  return store;
};

let store = configureStore([]);


render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
);
