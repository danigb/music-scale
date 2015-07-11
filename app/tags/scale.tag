<scale>
  <div if={ scale } class="details">
    <roots app={ opts.app } root={ root } />
    <h2>Scale: { state.root } { scale.name }
      <small if={ scale.altNames }>({ scale.altNames })</small>
    </h2>

    <h4>[{ scale.decimal }] { scale.binary } { scale.type }</h4>

    <h3>Notes</h3>
    <div class="notes">
      <canvas id="score0" width="500" height="100"></canvas>_
      <canvas id="score1" width="500" height="100"></canvas>_
    </div>
    <a href="#" onclick={ play }>Play</a>

    <h3>Modes</h3>
    <div each ={ scale.modes } class={ mode: true, can: cannonical }>
      <a href="#{ decimal }/{ name }">
        { parent.state.root } { name }
      </a>
      <div each={ binary } class={ digit: true, one: one, zero: !one, alt: alt }>
        { digit }
      </div>
    </div>
  </div>

  <style scoped>
    .mode { width: 100%; overflow: hidden; padding: 0.2em 0; height: 2em; }
    .mode a { float: left; display: block; width: 12em; }
    .mode div { float: left; overflow: hidden; text-indent: -100px;
      height: 1em; width: 1em; margin: 0.5em 0.1em 0.1em 0; border-radius: 1em;
      border: 1px solid white;
    }
    .mode.can { font-weight: bold; }
    .mode .zero { background-color: #DDD; }
    .mode .alt { margin-top: 0.5em; width: 1em; }
    .mode .one { background-color: #666; }
    .mode .one.alt { background-color: #333; }
  </style>

  <script>
    var self = this
    var app = this.opts.app
    this.state = app.state
    this.scale = app.getSelected()
    var canvas = [this.score0, this.score1]
    var VexFlow = typeof Vex !== 'undefined' ? Vex.Flow : null

    this.on('update', function() {
      var notes = app.getSelected().notes
      app.render(canvas[0], 400, 100, notes[0])
      if (notes.length > 1) app.render(canvas[1], 400, 100, notes[1])
    })

    play(e) {
      var notes = app.getSelected().notes[0]
      console.log(notes)
      app.play(notes)
    }

    select(e) {
      app.select(e.target.getAttribute('data-name'))
    }

    app.events.on('select', function(name) {
      self.scale = app.getSelected()
      self.root = app.state.root
      self.update()
      document.body.scrollTop = document.documentElement.scrollTop = 0
    })
  </script>
</scale>
