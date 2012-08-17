var baudio = require('../');
var spawn = require('child_process').spawn;

var b = baudio(function (t) {
    var n = t % (2 * Math.PI) > Math.PI ? 262 : 370;
    var f = n * Math.pow(2, 1/3 * Math.floor(8 * (1 + Math.sin(2 * t)) / 2));
    return Math.sin(t * f);
});

var aplay = spawn('aplay',['-r','44k','-c','2','-f','S16_LE']);
b.pipe(aplay.stdin);

var sox = spawn('sox',['-r','44k','-c','2','-t','s16','-','-o','melody.ogg']);
b.pipe(sox.stdin);
