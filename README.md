# music-scale

Create (western, well tempered) musical scales with javascript, implemented using binary numbers

Library usage example:

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

#### Create scales

You can create scales with `Scale.get` or `new Scale`.

With `Scale.get` you can get a scale by name, by binary string or its decimal equivalent.
Also the result is cached, so the next three calls returns the __same__ object:

```js
Scale.get('major')
Scale.get('101011010101')
Scale.get(2772)
```

With the constructor function a decimal number is required and always returns
a new instance (so __its not recommended__):

```js
var major = new Scale(2772)
new Scale('major') // => exception
new Scale('11000100000') // => exception
```

#### Scale names

Every scale can have one or more names:

```js
Scale.get('major').names() // => ['major', 'ionian']
```

By default, only three names are available: 'major', 'melodic minor', 'harmonic minor'
But you can load the library with other dictionaries:

```js
var Scale = require('music-scale/common') // 45 scale names
Scale.get('phrygian pentatonic')
var Scale = require('music-scale/all') // 86 scale names
Scale.geT('six tone symmetric')
```

See `common.js` and `all.js` in this repository.

#### Scale intervals

All scales have a `intervals()` method that returns an array of intervals.

```js
var major = new Scale(2772)
major.intervals() // => ['P1', 'M2', 'M3', 'P4', 'P5', 'M6', 'M7']
```

If you need note names, I recommend (ejem, my own library) [note-pitch](http://github.com/danigb/note-pitch):

```js
var Note = require('note-pitch')
Note.transpose('C', major.intervals()) //=> ['c4', 'd4', 'e4', 'f4', 'g4', 'a4', 'b4']
```

#### Modes

```js
major = new Scale(2772)
ionian = major.mode(1) // same scale
dorian = major.mode(2)
mixolydian = major.mode(5)
```

#### Coscale relationship

```js
var majorPentatonic = new Scale(2772).coscale()
majorPentatonic.binary // => '101001010100'
```

#### Scale reflection

```js
var major = new Scale(2772)
var lydian = major.reflection()
```

## Theory

This is a implementation of binary scales as presented in the awesome book [Arpeggio & Scale Resources](https://archive.org/details/ScaleAndArpeggioResourcesAGuitarEncyclopedia) by Rich Cochrane, chapter 18.

The following explanations are extracted from the book. (The book has a Creative Commons Usage Attribution-Noncommercial-No Derivative Works 3.0... thanks a lot Rich!)

### Binary representations of scales

The major scale is `1 0 1 0 1 1 0 1 0 1 0 1`. This number (2773 in decimal, see previous example) uniquely represents the Major scale. The method of representation is simple: each position, reading left to right, represents a note: 1, b2, 2 and so on. A `1` in that position means the note is included in the scale and a `0` means it is not included. So we have:

```
1   0   1   0   1   1    0   1   0   1   0   1
1  b2   2  b3   3   4   b5   5  b6   6  b7   7
```

### Scale modes

Note that modes of a scale are obtained by the technique known as 'bit rotation'. We would normally eliminate all those rows that begin with a zero, since they don't contain a root note:

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
