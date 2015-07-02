'use strict'
var Scale = require('../')

var MIN = parseInt('100000000000', 2)
var MAX = parseInt('111111111111', 2)

var scales = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0].map(function () { return [] })
for (var i = MIN; i <= MAX; i++) {
  var binary = i.toString(2)
  var scale = new Scale(binary)
  if (scale.leap() < 5) {
    scales[scale.length].push(scale)
  }
}

console.log(scales.map(function (s) { return s.length }))
console.log(scales[4].map (function (s) {
  return { num: s.numbers(), steps: s.steps() }
}))
//console.log(heptatonics.map(function (s) { return s.binary }))
