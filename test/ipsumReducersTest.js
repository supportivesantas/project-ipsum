const mocha = require('mocha');
const chai = require('chai');
const expect = chai.expect;
const assert = chai.assert;

const actions = require('../public/actions/ipsumActions.js');
const reducer = require('../public/reducers/ipsumReducers.js');

describe('Reducer Tests ', () => {
  it('Return the current state if no action is given', (done) => {
    const initState = reducer(undefined, {});
    assert.isObject(initState);
    done();
  });

  it('Should handle ADD_APPLICATION', (done) => {
    expect(reducer({ applications: [] }, { type: 'ADD_APPLICATION', payload: 'Matt is great' }).applications[0].payload)
      .to.equal('Matt is great');
    done();
  });
});
