import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import userReducer from './reducers/userReducer.js';
import applicationReducer from './reducers/applicationReducer.js';
import serverReducer from './reducers/serverReducer.js';
import getDataReducer from './reducers/getDataReducer.js';
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
  graphData: [
    {route: "Total", data: [{val:15, time: 30}, {val:35, time: 60} ]},
    {route: "route1", data: [{val:1, time: 30}, {val:6, time: 60} ]},
    {route: "route2", data: [{val:5, time: 30}, {val:5, time: 60} ]},
    {route: "route3", data: [{val:7, time: 30}, {val:9, time: 60} ]},
    {route: "route4", data: [{val:2, time: 30}, {val:15, time: 60} ]}
  ],
};

// configure store with initial state and allow Redux Chrome extension to view store
export default function configureStore(browserHistory, initialState = init) {
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

