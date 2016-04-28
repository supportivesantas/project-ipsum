import React from 'react';
import Redux from 'redux';
import { render } from 'react-dom';
import App from './components/App.js';
import { Provider } from 'react-redux';
import ipsumStore from './ipsumStore.js';

let store = ipsumStore.configureStore();


render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
);
