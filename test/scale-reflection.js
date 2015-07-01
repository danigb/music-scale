var vows = require('vows')
var assert = require('assert')
var Scale = require('../')

vows.describe('Scale reflection').addBatch({
  'reflection': function () {
    var major = new Scale(2773)
    assert.equal(major.reflection().binary, '101010110101')
  }
}).export(module)
