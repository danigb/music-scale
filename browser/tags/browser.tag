
<browser>
  <div class="app">
    <div class="search">
      <search app={ opts.app } />
    </div>
    <div class="scale">
      <scale app={ opts.app } />
    </div>
  </div>

  <style scoped>
    :scope { font-family: 'myriad pro', sans-serif; }
    .app a { color: black; }
    .app { width: 960px; margin: 40px auto; overflow: hidden; }
    .search { width: 33%; float: left; }
    .scale { margin-left: 33%; }
  </style>

</browser>
