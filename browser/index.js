var riot = require('riot')
var ScalesStore = require('./store.js')

// Tags
var browser = require('./browser.tag')
require('./search.tag')
require('./scale.tag')

var App = function (state) {
  this.state = state
  this.events = riot.observable({})
  this.scales = ScalesStore
  this.render = require('./render.js')
}

App.prototype.setPattern = function (pattern) {
  this.state.pattern = pattern
  this.events.trigger('search')
}

App.prototype.select = function (name) {
  this.state.selected = name
  this.events.trigger('select')
}

App.prototype.getSelected = function () {
  return this.scales.get(this.state.selected)
}
App.prototype.getResults = function () {
  return this.scales.search(this.state.pattern)
}

riot.mount(browser, { app: new App({
  pattern: '',
  selected: 'major'
}) })

setTimeout(function () {
  ScalesStore.build()
}, 500)
