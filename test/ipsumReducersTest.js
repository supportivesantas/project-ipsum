const mocha = require('mocha');
const chai = require('chai');
const expect = chai.expect;
const assert = chai.assert;

const actions = require('../public/actions/ipsumActions.js');
const reducer = require('../public/reducers/ipsumReducers.js');

describe('Reducer Tests ', () => {
  it('Return the initial state', (done) => {
    assert(Array.isArray(reducer(undefined, {})));
    expect(reducer(undefined, {}).length).to.equal(0);
    done();
  });

  it('Should handle DO_THING', (done) => {
    expect(reducer(undefined, { type: 'DO_THING', payload: 'Matt is great' })[0].payload).to.equal('Matt is great');
    done();
  });

});
