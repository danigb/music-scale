var vows = require('vows')
var assert = require('assert')
var names = require('../names')

vows.describe('names').addBatch({
  'main names': function () {
    assert.deepEqual(names().length, 89)
  },
  'aliases names': function () {
    assert.deepEqual(names(true).length, 108)
  }
}).export(module)
