var baudio = require('../');
var spawn = require('child_process').spawn;

var b = baudio();

b.push(function (t) {
    return Math.sin(
        (t % 15) * 150 * (t % 30)
        * Math.floor(Math.sin(t) * 5)
    ) + (t<<3) * (t & 0x7f) / 256;
});

b.push((function () {
    var c = 10;
    return function (t, i) {
        //var n = 20 + Math.floor(t / 3) * 3;
        var n = 28;
        c = c * (1 + Math.sin(i / 20000) / 10000);
        return Math.sin(t * 5000)
            * Math.max(0, Math.sin(t * n + c * Math.sin(t * 20)))
        ;
    };
})());

b.play();
