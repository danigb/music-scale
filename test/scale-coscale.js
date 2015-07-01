var vows = require('vows')
var assert = require('assert')
var Scale = require('../')

vows.describe('Scale coscale').addBatch({
  'coscale': function () {
    var major = new Scale(2773)
    assert.equal(major.coscale().binary, '101001010100')
  }
}).export(module)
