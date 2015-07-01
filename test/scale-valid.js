var vows = require('vows')
var assert = require('assert')
var Scale = require('../')

vows.describe('Scale steps').addBatch({
  'should have three notes or more': function () {
    assert(new Scale('10101000').valid())
    assert(!new Scale('10100000').valid())
  }
}).export(module)
