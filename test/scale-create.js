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
      var error = function () { return new Scale('010101') }
      assert.throws(error, /number not valid/)
    },
    'should have root': function () {
      var error = function () { return new Scale('010101000000') }
      assert.throws(error, /number not valid/)
    }
  },
  'can give names to a scale': {
    'no name': function () {
      assert.equal(new Scale(2773).name(), null)
    },
    'single name': function () {
      var s = new Scale(2773, 'major')
      assert.equal(s.name(), 'major')
    },
    'multiple names': function () {
      var s = new Scale(2773, ['ionian', 'major'])
      assert.equal(s.name(), 'ionian')
      assert.deepEqual(s.names(), ['ionian', 'major'])
    }
  },
  'integer': function () {
    var s = new Scale(2773)
    assert.equal(s.decimal, 2773)
    assert.equal(s.binary, '101011010101')
  }
}).export(module)
