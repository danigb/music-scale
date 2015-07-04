
<scales>
  <h1>{ total } scales</h1>

  <div if={ selected }>
    <div class="selected-scale">
      <h2 if={ selected.name() }>{ selected.name() }</h2>
      <h3>[{ selected.decimal }] { selected.binary }</h3>
    </div>
  </div>

  <div class="scales" data-number="{ total }">
    <div class="{ scale: true, named: named }" each={ scales } data-scale={ decimal }
      onclick={ parent.select }>
      { decimal }
    </div>
  </div>
  <form onsubmit={ generate }>
    <button>Generate scales</button>
  </form>



  <!-- this script tag is optional -->
  <script>
    this.scales = []
    this.total = 0

    select(e) {
      if (this.display) this.display.classList.toggle('active')
      this.display = e.target
      this.display.classList.toggle('active')
      this.selected = Scale.get(e.target.getAttribute('data-scale'))
    }

    generate(e) {
      this.scales.push.apply(this.scales, Scale.all())
      console.log(this.scales)
      this.scales.forEach(function(s) { s.named = s.name() ? true : false })
      this.total = this.scales.length
    }
  </script>

</scales>
