var baudio = require('../');

var n = 0;
var b = baudio(function (t) {
    return Math.sin(t * 400 * Math.PI * 2) + Math.sin(t * 500) * (t % 2 > 1);
});
b.play();
