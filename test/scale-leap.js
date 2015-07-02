var vows = require('vows')
var assert = require('assert')
var Scale = require('../')

vows.describe('Scale steps').addBatch({
  'leap': function () {
    assert.equal(new Scale('101010101010').leap(), 2)
    assert.equal(new Scale('101010001010').leap(), 4)
    assert.equal(new Scale('101010000010').leap(), 6)
  }
}).export(module)
