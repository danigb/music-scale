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

riot.mount(browser, { app: new App({
  pattern: '',
  selected: 'major'
}) })
