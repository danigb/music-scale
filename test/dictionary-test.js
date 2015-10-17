var vows = require('vows')
var assert = require('assert')
var dictionary = require('../dictionary')

vows.describe('dictionary').addBatch({
  'no aliases': function () {
    var scales = dictionary({ major: '1 2 3 4 5 6 7', minor: '1 2 3b 4 5 6b 7b' })
    assert.equal(scales('major', 'D').join(' '), 'D E F# G A B C#')
  },
  'alias': function () {
    var scales = dictionary({ major: '1 2 3 4 5 6 7', minor: '1 2 3b 4 5 6b 7b' },
      {eolian: 'minor'})
    assert.deepEqual(scales('eolian', 'D'), scales('minor', 'D'))
  }
}).export(module)
