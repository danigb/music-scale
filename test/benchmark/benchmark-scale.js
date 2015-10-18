// BENCHMARKS
// [0.10.0] build scale x 70,716 ops/sec ±0.50% (101 runs sampled)
// [0.11.0] build scale x 54,052 ops/sec ±0.60% (98 runs sampled)
var Benchmark = require('benchmark')
var scale = require('../../')

console.log(scale('C D E F G A B', 'D'))

new Benchmark.Suite()
.add('build scale', function () {
  scale('C D E F G A B', 'D')
})
.on('cycle', function (event) {
  console.log(String(event.target))
})
.on('complete', function () {
  console.log('Fastest is ' + this.filter('fastest').pluck('name'))
})
.run({ 'async': true })
