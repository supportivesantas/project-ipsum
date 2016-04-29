const mocha = require('mocha');
const chai = require('chai');
const expect = chai.expect;
const assert = chai.assert;
const actions = require('../public/actions/ipsumActions.js');
const reducer = require('../public/reducers/ipsumReducers.js');

describe('Reducer Tests ', () => {
  beforeEach('creates a store to test with', (done) => {
    done();
  });
  it('Return the current state if no action is given', (done) => {
    const initState = reducer(undefined, {});
    assert.isObject(initState);
    done();
  });

  it('Should handle ADD_APPLICATION', (done) => {
    expect(reducer({ applications: [] }, actions.ADD_APPLICATION('Matt is great')).applications[0].payload)
      .to.equal('Matt is great');
    done();
  });

  it('Should handle POPULATE_USER_DATA', (done) => {
    expect(reducer({ user: { email: '', handle: '' } },
      actions.POPULATE_USER_DATA('m@m.com', 'mbresnan1701')).user.handle)
      .to.equal('mbresnan1701');
    done();
  });
});
