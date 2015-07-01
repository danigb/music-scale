var vows = require('vows')
var assert = require('assert')
var Scale = require('../')

vows.describe('Binary Scales').addBatch({
  'simple string': function () {
    var s = new Scale('101011010101')
    assert.equal(s.decimal, 2773)
    assert.equal(s.binary, '101011010101')
  },
  'binary string': {
    'must have 12 digits': function () {
      assert.throws(function () { return new Scale('010101') }, /12/)
    },
    'should have root': function () {
      assert.throws(function () { return new Scale('010101000000') }, /root/)
    }
  },
  'name': function () {
    var s = new Scale(2773, 'major')
    assert.equal(s.name, 'major')
  },
  'integer': function () {
    var s = new Scale(2773)
    assert.equal(s.decimal, 2773)
    assert.equal(s.binary, '101011010101')
  }
}).export(module)
