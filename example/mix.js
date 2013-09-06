var baudio = require('../');

var b = baudio(function (t, i) {
    // taken from some demoscene video
    return ((
        (i & 0x71) * Math.floor(i / 3571) * Math.floor(i / 3559)
    ) % 256) / 128 - 1;
});
b.play();
