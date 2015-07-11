'use strict'

var riot = require('riot')

module.exports = App

var ROOTS = 'c db d eb e f f# gb g ab a bb b'.split(' ').map(function (root) {
  return root.replace(/^./, function (match) { return match.toUpperCase() })
})

function App (state) {
  this.state = state
  this.events = riot.observable({})
  this.scales = require('./scales.js')
  this.render = require('./render.js')
  this.route = require('./router.js')(this)
  this.play = require('./player.js')
}

App.prototype.getRoots = function () {
  var selected = this.state.root
  return ROOTS.map(function (name) {
    return { name: name, selected: name === selected }
  })
}

App.prototype.setRoot = function (root) {
  this.state.root = root
  this.events.trigger('select')
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
  return this.scales.get(this.state.selected, this.state.root)
}
App.prototype.getResults = function () {
  return this.scales.search(this.state.pattern)
}
