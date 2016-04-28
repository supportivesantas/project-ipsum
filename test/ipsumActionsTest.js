const mocha = require('mocha');
const chai = require('chai');
const expect = chai.expect;
const assert = chai.assert;

const actions = require('../public/actions/ipsumActions.js');


describe('Actions Tests ', () => {
  it('Returns an object for a valid action', (done) => {
    const testAction = actions.ADD_APPLICATION('Matt is the greatest');
    assert.isObject(testAction);
    done();
  });

  it('Attaches type and payload to action object', (done) => {
    const testAction = actions.ADD_APPLICATION('Matt is the greatest');
    expect(testAction.type).to.equal('ADD_APPLICATION');
    expect(testAction.payload).to.equal('Matt is the greatest');
    done();
  });
});
