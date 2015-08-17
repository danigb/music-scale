# music-scale

## Deprecated: use github.com/danigb/tonal

Create (western, well tempered) musical scales with javascript:

```js
var Scale = require('music-scale');
var major = Scale.get('major');
major.intervals(); // => ['P1', 'M2', 'M3', 'P4', 'P5', 'M6', 'M7']
major.mode(2).name(); // => 'dorian'
```

`music-scale` is inspired by the works of [Rich Cochrane](http://cochranemusic.com), [Walter Zettel](http://www.muzuu.org/new_life/pics/simpleblog/scales/scalesadvice.html) and [William Zeitler](http://www.allthescales.org/)

## Usage

#### Installation

Install with npm: `npm install music-scale` and require it:

```js
var Scale = require('music-scale')
```

#### Scale names

In order to reduce the code, you can choose the size of the dictionary.
By default, only three scale names are available: 'major', 'melodic minor', 'harmonic minor'
But you can load the library with other dictionaries, so instead of `require('music-scale')` you can:

```js
var Scale = require('music-scale') // 3 scale names
Scale.get('major')

// or ...
var Scale = require('music-scale/common') // 45 scale names
Scale.get('phrygian pentatonic')

// or ...
var Scale = require('music-scale/all') // 86 scale names
Scale.geT('six tone symmetric')
```

See [`common.js`](https://github.com/danigb/music-scale/blob/master/common.js) and
[`all.js`](https://github.com/danigb/music-scale/blob/master/all.js) in this repository.

## API

#### Scale.get(name | binary | decimal)

Get a scale by name, by binary string or its decimal equivalent.
The result is cached and the scales are created on demand:

```js
Scale.get('major') === Scale.get('101011010101') === Scale.get(2772)
```

#### Scale.all()

You can create all the possibles scales (2048, see theory below) with this method:

```js
Scale.MIN; // => 2048 ('100000000000')
Scale.MAX; // => 4905 ('111111111111')
Scale.all().length; // => 2048
```

You can use it to filter the scales:

```js
var pentatonics = Scale.all.filter(function(scale) { return scale.length === 5 })
```

For example, to recreate the [allthescales.org](http://allthescales.org) scales,
you must filter by leap:

```js
var allthescales = Scale.all.filter(function(scale) { return scale.leap() < 5 })
var heptatonics = allthescales.filter(function(scale) { return scale.length === 7 })
var cannonicalHeptatonics = heptatonics.filter(function(scale) { return scale.isCannonical() })
heptatonics.length // => 413
cannonicalHeptatonics.length // => 59
```

#### `new Scale(decimal)`

You can use the constructor to create a Scale, but only decimal numbers are allowed
and you loose the cache, so I can't think any reason to use it:

```js
var major = new Scale(2773) // don't do that, use Scale.get(2773)
new Scale('major') // => exception
new Scale('11000100000') // => exception
```

## Scale methods

#### name() and names()

Every scale can have one or more names. `name` method always returns the first one:

```js
Scale.get('major').names() // => ['major', 'ionian']
Scale.get('ionian').name() // => 'major'
```

#### intervals()

Returns an array of intervals:

```js
var major = new Scale(2772)
major.intervals() // => ['P1', 'M2', 'M3', 'P4', 'P5', 'M6', 'M7']
```

If you need note names, I recommend (ejem, my own library) [note-pitch](http://github.com/danigb/note-pitch):

```js
var Note = require('note-pitch')
Note.transpose('C', major.intervals()) //=> ['c4', 'd4', 'e4', 'f4', 'g4', 'a4', 'b4']
```

#### modes() and mode(number)

Get the scale modes:

```js
var major = new Scale(2772)
var ionian = major.mode(1) // 1 based index
var major === ionian // true, same scale
var dorian = major.mode(2)
var mixolydian = major.mode(5)
var major.mode(1) === major.mode(8) // true, same scale
```

#### cannonicalMode() and isCannonical()

Get the cannonical mode, as defined in allthescales.org:

> The "canonical form" of a scale is that mode that has the greatest possible number of its larger steps at the beginning of the mode, and the greatest possible number of its smaller steps at the end of the mode. For example, considering the diatonic scale, the mode with the greatest number of larger intervals first is the one beginning with the greatest sequence of whole tones — the Lydian mode.

```js
var major = Scale.get('major')
major.cannonicalMode().name() // => 'lydian'
var dorian = major.mode(2)
dorian.cannonicalMode().name() // => 'lydian'
```

#### coscale()

Get the coscale:

```js
var majorPentatonic = new Scale(2772).coscale()
majorPentatonic.binary // => '101001010100'
```

#### reflection()

Get the reflected scale:

```js
var major = new Scale(2772)
var lydian = major.reflection()
```

## Theory

This is a implementation of binary scales as presented in the awesome book [Arpeggio & Scale Resources](https://archive.org/details/ScaleAndArpeggioResourcesAGuitarEncyclopedia) by Rich Cochrane, chapter 18.

The following explanations are extracted from the book. (The book has a Creative Commons Usage Attribution-Noncommercial-No Derivative Works 3.0... thanks a lot Rich!)

### Binary representations of scales

> The major scale is `1 0 1 0 1 1 0 1 0 1 0 1`. This number (2773 in decimal, see previous example) uniquely represents the Major scale. The method of representation is simple: each position, reading left to right, represents a note: 1, b2, 2 and so on. A `1` in that position means the note is included in the scale and a `0` means it is not included. So we have:

```
1   0   1   0   1   1    0   1   0   1   0   1
1  b2   2  b3   3   4   b5   5  b6   6  b7   7
```

### 2048 scales

All the scales have root, so the smallest scale is '100000000000' (2048) and
the biggest is '111111111111' (4095), so the total number is 2048 (4096 - 2048)

Most of they are not interesting enough to be used in music.
For example, allthescales.org limit all the possibilities to those with leap < 5 (1490)

### Scale modes

> Note that modes of a scale are obtained by the technique known as 'bit rotation'. We would normally eliminate all those rows that begin with a zero, since they don't contain a root note:

```
101011010101 // ionian
010110101011
101101010110 // dorian
011010101101
110101011010 // phrygian
101010110101 // lydian
010101101011
101011010110 // mixolydian
010110101101
101101011010 // aeolian
011010110101
110101101010 // locrian
```
