var Note = require('note-pitch')

module.exports = Escalas

function Escalas () {
  return
}

var INTERVALS = ['P1', 'm2', 'M2', 'm3', 'M3', 'P4', 'd5', 'P5', 'm6', 'M6', 'm7', 'M7']

Escalas.build = function (name, root) {
  return Note.transpose(root, Escalas.intervals(name))
}
Escalas.intervals = function (name) {
  return name.toString(2).split('').reduce(function (intervals, val, index) {
    if (val === '1') intervals.push(INTERVALS[index])
    return intervals
  }, [])
}
