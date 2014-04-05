# baudio

generate audio streams with functions

![oscilloscope](http://substack.net/images/oscilloscope.png)

# videos

[the science and mathematics of music](http://www.youtube.com/watch?v=i_0DXxNeaQ0)

[making algorithmic music with baudio](http://www.youtube.com/watch?v=2oz_SwhBixs)

# example

``` js
var baudio = require('baudio');

var n = 0;
var b = baudio(function (t) {
    var x = Math.sin(t * 262 + Math.sin(n));
    n += Math.sin(t);
    return x;
});
b.play();
```

# methods

``` js
var baudio = require('baudio')
```

## var b = baudio(opts, fn)

Return a readable stream of raw audio data based on the channel functions
provided. Passing `fn` is a short-hand for `b.push(fn)`.

The `opts.rate` is the rate of the output stream in Hz, default 44000.

## b.push(ix=0, fn)

Push a new track onto the channel at index `ix` with the function `fn(t, i)` for
the time in seconds `t` and a counter `i`.

## b.addChannel(type, fn)

Push a new audio channel of `type`, optionally initializing the channel with a
function `fn(t, i)`.

`type` defaults to `'float'` which expects inputs in the range `[-1,1]` and
clips higher and lower values.

`type` can also be a power of 2 number of bits to use for each sample which
expects an integer output value in `[0,Math.pow(2,type)-1]`.


## b.play(opts)

Play the audio demo with the [play command](http://sox.sourceforge.net/).

You can also call `b.pipe()` to handle the output stream yourself.

`opts` are passed directly through to sox.

## b.record(file, opts)

Save the audio stream to `file` using the
[sox command](http://sox.sourceforge.net/).

You can also call `b.pipe()` to handle the output stream yourself.

`opts` are passed directly through to sox.

# usage

```
usage: baudio FILE {-o OUTFILE} OPTIONS

  Play a javascript music FILE. FILE should export a method signature of:

    return function (t) {
        return Math.sin(2 * Math.PI * t * 441);
    };
  
  where the return value is between -1 and 1, inclusive. Values outside of the
  domain -1 through 1 will be clipped.
  
  If -o is given, output will be written to OUTFILE instead. OUTFILE can be any
  media file that sox supports for output: .mp3, .wav, .ogg, whatever.
  
  You can also use "-" for -o to write to stdout.

  Extra OPTIONS include:

    -d, --duration   How long the song should play as a human-parseable string.

    -t, --offset     Jump to this time offset as a human-parseable string.
 
  Example usage:

    Play a song:

      baudio beepboop.js

    Play a song for 30 seconds:

      baudio beepboop.js -d 30s

    Record 3 minutes of audio to beepboop.mp3 starting at 20 seconds:

      baudio beepboop.js -d 3m -t 20s -o beepboop.mp3

```

# install

With [npm](http://npmjs.org), to get the library do:

```
npm install baudio
```

and to get the command, do:

```
npm install -g baudio
```

# license

MIT
