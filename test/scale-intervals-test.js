var vows = require('vows')
var assert = require('assert')
var Scale = require('../')

Scale.use(require('../lib/scales.json'))

var tests = {}
var all = require('./scale-intervals.json')
Object.keys(all).forEach(function (name) {
  tests[name] = function () {
    var spell = all[name]
    var intervals = new Scale(name).intervals().join(',')
    assert(intervals === spell,
      'WRONG ' + name + ' ' + spell + ' | ' + intervals)
  }
})

vows.describe('Scale intervals').addBatch({
  'major': function () {
    var s = new Scale(2773)
    assert.deepEqual(s.intervals(), ['P1', 'M2', 'M3', 'P4', 'P5', 'M6', 'M7'])
  },
  'all scales': tests
}).export(module)
