const mocha = require('mocha');
const chai = require('chai');
const expect = chai.expect;
const assert = chai.assert;
const actions = require('../public/actions/ipsumActions.js');
const userReducer = require('../public/reducers/userReducer.js');
const appReducer = require('../public/reducers/applicationReducer.js');
const servReducer = require('../public/reducers/serverReducer.js');

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
