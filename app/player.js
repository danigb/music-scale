'use strict'

var ctx = new window.AudioContext()
var soundfont = require('soundfont-player')(ctx)

var instrument = soundfont.instrument('acoustic_grand_piano')

module.exports = function (notes) {
}
