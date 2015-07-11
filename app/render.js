var parse = require('note-parser')
var VexFlow = Vex.Flow

module.exports = function (canvas, width, height, notes) {
  var renderer = new VexFlow.Renderer(canvas, VexFlow.Renderer.Backends.CANVAS)
  var ctx = renderer.getContext()
  ctx.fillStyle = 'white'
  ctx.fillRect(0, 0, width, height)
  ctx.fillStyle = 'black'
  var stave = new VexFlow.Stave(10, 0, width)
  stave.addClef('treble').setContext(ctx).draw()

  var tickables = notes.map(function (name) {
    var note = parse(name)
    var staveNote = new VexFlow.StaveNote({ keys: [note.pc + note.acc + '/' + note.oct], duration: 'q' })
    if (note.acc) {
      staveNote.addAccidental(0, new VexFlow.Accidental(note.acc))
    }
    return staveNote
  })
  tickables.push(new VexFlow.BarNote({
    type: VexFlow.Barline.END
  }))
  var voice = new VexFlow.Voice({
    num_beats: 4,
    beat_value: 4,
    resolution: VexFlow.RESOLUTION
  })
  voice.mode = VexFlow.Voice.Mode.SOFT

  // Add notes to voice
  voice.addTickables(tickables)

  // Format and justify the notes to width pixels
  var formatter = new VexFlow.Formatter()
  formatter.joinVoices([voice]).format([voice], width)

  // Render voice
  voice.draw(ctx, stave)
}
