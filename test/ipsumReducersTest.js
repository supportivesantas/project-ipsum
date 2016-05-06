const mocha = require('mocha');
const chai = require('chai');
const expect = chai.expect;
const assert = chai.assert;
const actions = require('../public/actions/ipsumActions.js');
const userReducer = require('../public/reducers/userReducer.js');
const appReducer = require('../public/reducers/applicationReducer.js');
const servReducer = require('../public/reducers/serverReducer.js');
const getDataReducer = require('../public/reducers/getDataReducer.js');
const lineGraphTitleReducer = require('../public/reducers/lineGraphTitleReducer');
const serverSelectReducer = require('../public/reducers/serverSelectReducer.js');


describe('Application Reducer Tests', () => {

  it('Return the current state if no action is given', (done) => {
    const initState = appReducer({}, {});
    assert.isObject(initState);
    done();
  });

  it('Should handle ADD_APPLICATION', (done) => {
    expect(appReducer([], actions.ADD_APPLICATION('Matt is great'))[0].payload)
      .to.equal('Matt is great');
    done();
  });

  it('Should handle REMOVE_APPLICATION', (done) => {
    expect(appReducer([{ id: 0, thing: 'mwb' }, { id: 1, thing: 'QQ' }], actions.REMOVE_APPLICATION(1))[1])
      .be.undefined;
    done();
  });
  
  it('Should handle MASS_POPULATE_APPS', (done) => {
    expect(appReducer([], actions.MASS_POPULATE_APPS([{ id: 0, thing: 'mwb' }, { id: 1, thing: 'QQ' }])).length)
      .to.equal(2);
    done();
  });
});

describe('Get Data Reducer Tests ', () => {

  it('Return the current state if no action is given', (done) => {
    const initState = getDataReducer([], []);
    assert.isArray(initState);
    done();
  });

  it('Should handle ADD_SERVER_DATA', (done) => {
    const test = getDataReducer([],
      actions.ADD_SERVER_DATA([{route: 'Total', data: ['test']}]));
    expect(test[0].route).to.equal('Total');
    expect(test[0].data[0]).to.equal('test');
    done();
  });
});

describe('Line Graph Title Reducer Tests ', () => {

  it('Return the current state if no action is given', (done) => {
    const initState = lineGraphTitleReducer([], []);
    assert.isArray(initState);
    done();
  });

  it('Should handle ADD_LINE_GRAPH_TITLE', (done) => {
    const test = lineGraphTitleReducer([],
      actions.ADD_LINE_GRAPH_TITLE('/Total'));
    expect(test[0]).to.equal('/Total');
    done();
  });
});

describe('Server Reducer Tests', () => {

  it('Return the current state if no action is given', (done) => {
    const initState = servReducer({}, {});
    assert.isObject(initState);
    done();
  });

  it('Should handle ADD_SERVER', (done) => {
    expect(servReducer([{ ip: '5.5.5.5', platform: 'AWS', app: 'Things' }],
      actions.ADD_SERVER('1.2.3.4', 'Azure', 'CoolApp'))[1].ip)
      .to.equal('5.5.5.5');
    done();
  });

  it('Should handle REMOVE_SERVER', (done) => {
    expect(servReducer([{ id: 0, ip: '1.1.1.1', platform: 'Digital Ocean', app: 'MWBISCOOL', active: 'True' },
  { id: 1, ip: '4.3.2.1', platform: 'Heroku', app: 'Things', active: 'False' }], actions.REMOVE_SERVER(1))[1])
      .be.undefined;
    done();
  });

  it('Should handle MASS_POPULATE_SERVERS', (done) => {
    expect(servReducer([], actions.MASS_POPULATE_SERVERS([{ id: 0, ip: '1.1.1.1', platform: 'Digital Ocean', app: 'MWBISCOOL', active: 'True' },
     { id: 1, ip: '4.3.2.1', platform: 'Heroku', app: 'MWBISCOOL', active: 'False' }])).length)
      .to.equal(2);
    done();
  });

});

describe('Server Select Reducer Tests ', () => {

  it('Return the current state if no action is given', (done) => {
    const initState = serverSelectReducer({}, {});
    assert.isObject(initState);
    done();
  });

  it('Should handle ADD_SERVER_SELECTION', (done) => {
    const test = serverSelectReducer({id: 1},
      actions.ADD_SERVER_SELECTION({id: 2}));
    expect(test.id).to.equal(2);
    done();
  });
});

describe('User Reducer Tests ', () => {

  it('Return the current state if no action is given', (done) => {
    const initState = userReducer({}, {});
    assert.isObject(initState);
    done();
  });

  it('Should handle POPULATE_USER_DATA', (done) => {
    const test = userReducer({ user: { handle: '', isLogged: false } },
      actions.POPULATE_USER_DATA('mbresnan1701'));
    expect(test.handle).to.equal('mbresnan1701');
    expect(test.isLogged).to.equal(true);
    done();
  });
});
