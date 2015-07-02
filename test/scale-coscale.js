var vows = require('vows')
var assert = require('assert')
var Scale = require('../')

vows.describe('Scale coscale').addBatch({
  'coscale': function () {
    var major = Scale.get('major')
    assert.equal(major.coscale().binary, '101001010100')
  }
}).export(module)
