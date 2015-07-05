var riot = require('riot')
var Scale = require('music-scale/all')

module.exports = function (app) {
  function route (decimal, name) {
    decimal = decimal || ''
    var hash = '' + decimal
    if (name) hash += '/' + name
    riot.route(hash)
  }

  riot.route(function (decimal, name) {
    var scale = /^\d{4}$/.test(decimal) ? Scale.get(+decimal) : null
    if (scale) {
      if (!/^\s*$/.test(name)) {
        app.select(scale.name() || scale.decimal)
      } else {
        route(scale.decimal, scale.name() || scale.binary)
      }
    } else {
      var clean = decodeURIComponent(name)
      scale = Scale.get(clean)
      if (scale) route(scale.decimal, name)
    }
  })

  return route
}
