import React from 'react';
import Redux from 'redux';
import { render } from 'react-dom';
import App from './components/App.js';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import actions from './actions/ipsumActions.js';
import reducers from './reducers/ipsumReducers.js';

let store = createStore(reducers);


render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
);
