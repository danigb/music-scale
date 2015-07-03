
<scales>
  <h1>{ total } scales</h1>

  <div if={ selected }>
    <div class="selected-scale">
      <h2 if={ selected.name() }>{ selected.name() }</h2>
      <h3>[{ selected.decimal }] { selected.binary }</h3>
    </div>
  </div>

  <div class="scales">
    <div class="{ scale: true, named: named }" each={ scales.filter(filter) } data-scale={ decimal }
      onclick={ parent.select }>
      { decimal }
    </div>
  </div>
  <form onsubmit={ generate }>
    <button>Generate scales</button>
  </form>



  <!-- this script tag is optional -->
  <script>
    console.log('scale')
    //this.scales = Scale.all().filter(function (s) { return s.length === 5 })
    this.scales = []
    this.total = 0

    edit(e) {
      this.text = e.target.value
    }

    select(e) {
      if (this.display) this.display.classList.toggle('active')
      this.display = e.target
      this.display.classList.toggle('active')
      this.selected = Scale.get(e.target.getAttribute('data-scale'))
    }

    generate(e) {
      this.scales = Scale.all()
      this.scales.forEach(function(s) { s.named = s.name() ? true : false })
      this.total = this.scales.length
    }
  </script>

</scales>
