var riot = require('riot')
var App = require('./app.js')
var Scale = require('music-scale/all')

// Tags
var browser = require('./tags/browser.tag')
require('./tags/search.tag')
require('./tags/scale.tag')
require('./tags/roots.tag')

var app = new App({
  pattern: '',
  selected: 'major',
  root: 'C'
})

riot.mount(browser, { app: app })

riot.route(function (decimal, name) {
  var scale
  if (decimal && name) {
    scale = Scale.get(+decimal)
    app.select(scale.name() || scale.decimal)
  } else if (decimal) {
    scale = Scale.get(+decimal)
    riot.route('' + scale.decimal + '/' + (scale.name() || 'unknown name'))
  } else if (name) {
    scale = Scale.get(name)
    riot.route('' + scale.decimal + '/' + name)
  } else {
  }
})

setTimeout(function () {
  app.scales.build()
}, 500)
