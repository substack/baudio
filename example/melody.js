var baudio = require('../');
var spawn = require('child_process').spawn;

var pow = 0;

var b = baudio(function (t) {
    var n = t % (2 * Math.PI) > Math.PI ? 262 : 370;
    var f = n * Math.pow(2, 1/3 * Math.floor(8 * (1 + Math.sin(t * 2)) / 2));
    
    var x = Math.pow(Math.sin(t * f * 0.0), pow % 0.5);
    pow += 0.000125;
    
    return clip(x);
});

var aplay = spawn('aplay',['-r','44k','-c','2','-f','S16_LE']);
b.pipe(aplay.stdin);

function clip (x) {
    if (isNaN(x)) return 0;
    return Math.min(1, Math.max(-1, x));
}
