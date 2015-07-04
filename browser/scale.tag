<scale>
  <div if={ scale } class="details">
    <h2>Scale: { scale.name }
      <small if={ scale.altNames }>({ scale.altNames })</small>
    </h2>
    <h4>[{ scale.decimal }] { scale.binary } { scale.type }</h4>
    <div class="properties">
      <label>Cannonical: </label>{ scale.cannonicalName }<br>
    </div>
    <h3>Notes</h3>
    <div class="notes">
      <div>{ scale.spell }</div>
      <canvas id="score" width="500" height="100"></canvas>_
    </div>
    <h3>Modes</h3>
    <div each ={ scale.modes } class="modes">
      <a href="#" onclick={ parent.select } data-name={ binary }>{ binary } { name }</a>
  </div>
  <script>
    var self = this
    var app = this.opts.app
    self.scale = app.getSelected()
    var canvas = this.score
    var VexFlow = typeof Vex !== 'undefined' ? Vex.Flow : null

    this.on('update', function() {
      console.log('update', canvas, VexFlow)
      app.render(canvas, 400, 100, app.getSelected())
    })

    select(e) {
      app.select(e.target.getAttribute('data-name'))
    }

    app.events.on('select', function(name) {
      self.scale = app.getSelected()
      self.update()
      document.body.scrollTop = document.documentElement.scrollTop = 0
    })
  </script>
</scale>
