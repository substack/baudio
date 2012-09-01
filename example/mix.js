var baudio = require('../');

var b = baudio();
b.push(8, function (t, i) {
    // taken from some demoscene video
    return (i & 0x71) * Math.floor(i / 1000);
});
b.play();
