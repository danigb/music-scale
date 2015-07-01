var vows = require('vows')
var assert = require('assert')
var Scale = require('../')

vows.describe('Scale steps').addBatch({
  'should have at least 3 notes': function () {
    assert(!new Scale('101000000000').isMusical())
    assert(new Scale('101010000000').isMusical())
    assert(new Scale('110110110110').isMusical())
  },
  'more than two consecutive semitones': function () {
    assert(!new Scale('111000000000').isMusical())
  },
  'interval larger than a major third and fewer than five notes': function () {
  }
}).export(module)
