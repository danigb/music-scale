var vows = require('vows')
var assert = require('assert')
var Scale = require('../')

vows.describe('Scale length').addBatch({
  'length is the number of notes': function () {
    assert.equal(new Scale('100000000000').length, 1)
    assert.equal(new Scale('110000000000').length, 2)
    assert.equal(new Scale('111000000000').length, 3)
    assert.equal(new Scale('111111111111').length, 12)
  }
}).export(module)
