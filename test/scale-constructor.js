var vows = require('vows')
var assert = require('assert')
var Scale = require('../')

vows.describe('Binary Scales').addBatch({
  'name': function () {
    var s = new Scale('major')
    assert.equal(s.decimal, 2773)
    assert.equal(s.binary, '101011010101')
  },
  'binary string': function () {
    var s = new Scale('101011010101')
    assert.equal(s.decimal, 2773)
    assert.equal(s.binary, '101011010101')
  },
  'integer': function () {
    var s = new Scale(2773)
    assert.equal(s.decimal, 2773)
    assert.equal(s.binary, '101011010101')
  }
}).export(module)
