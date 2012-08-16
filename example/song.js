var baudio = require('./');
var spawn = require('child_process').spawn;
var aplay = spawn('aplay', [ '-r', '44k', '-c', '2', '-f', 'S16_LE' ]);

var n = 0;
baudio({ rate : 44000 }, function (t) {
    var x = Math.sin(t * 262 + Math.sin(n));
    n += Math.sin(t);
    return x;
}).pipe(aplay.stdin);
