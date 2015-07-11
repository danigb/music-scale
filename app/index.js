var riot = require('riot')
var App = require('./app.js')

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

var route = window.location.hash || '2773/major'
window.location.hash = ''
app.route(route)

setTimeout(function () {
  app.scales.build()
}, 500)
