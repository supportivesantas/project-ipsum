import React from 'react';
import Redux from 'redux';

import { render } from 'react-dom';
import App from './components/App.js';
import { Provider } from 'react-redux';
import configureStore from './ipsumStore.js';


const store = configureStore();

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
);
