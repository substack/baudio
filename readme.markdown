# baudio

generate audio streams with functions

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

The `opts.size` is the size of data chunks to emit, default 1024.

## b.push(type, fn)

Push a new audio channel of `type` with the function `fn(t, i)` for the time in
seconds `t` and a counter `i`.

`type` defaults to `'float'` which expects inputs in the range `[-1,1]` and
clips higher and lower values.

`type` can also be a power of 2 number of bits to use for each sample which
expects an integer output value in `[0,Math.pow(2,type)-1]`.

## b.play()

Play the audio demo with the [play command](http://sox.sourceforge.net/).

You can also call `b.pipe()` to handle the output stream yourself.

## b.record(file)

Save the audio stream to `file` using the
[sox command](http://sox.sourceforge.net/).

You can also call `b.pipe()` to handle the output stream yourself.

# install

With [npm](http://npmjs.org) do:

```
npm install baudio
```

# license

MIT
