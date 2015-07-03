'use strict'
var Scale = require('../')

var cannonicals = Scale.all().filter(function (scale) {
  return scale.length === 7 && scale.leap() < 5 && scale.isCannonical()
})
console.log(cannonicals.map(function (scale) {
  return '' + scale.decimal + ' ' + scale.binary
}))
console.log('Total scales: ', Scale.all().length, Scale.MIN, Scale.MAX)
console.log('Cannonical heptatonics: ', cannonicals.length)
