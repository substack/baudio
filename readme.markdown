# baudio

generate audio streams with functions

# example

``` js
var baudio = require('baudio');
var spawn = require('child_process').spawn;
var aplay = spawn('aplay', [ '-r', '44k', '-c', '2', '-f', 'S16_LE' ]);

var n = 0;
baudio(function (t) {
    var x = Math.sin(t * 262 + Math.sin(n));
    n += Math.sin(t);
    return x;
}).pipe(aplay.stdin);
```

# methods

``` js
var baudio = require('baudio')
```

## baudio(opts, fn)

Return a readable stream of raw audio data based on the function `fn(t)` where
`t` is the time in seconds.

The `opts.rate` is the rate of the output stream in Hz, default 44000.

The `opts.size` is the size of data chunks to emit, default 1024.

# install

With [npm](http://npmjs.org) do:

```
npm install baudio
```

# license

MIT
