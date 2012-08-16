var baudio = require('../');
var spawn = require('child_process').spawn;
var aplay = spawn('aplay', [ '-r', '44k', '-c', '2', '-f', 'S16_LE' ]);

baudio(function (t) {
    var clips = [
        function () {
            return Math.sin(
                (t % 15) * 150 * (t % 30)
                * Math.floor(Math.sin(t) * 5)
            );
        },
        function () {
            var x = Math.sin(t / 10) * 5 + 1;
            return Math.sin(800 * Math.pow(x, 3));
        },
        function () {
            var x = (Math.sin(t / 20) + 1) * 10 * (t % 30);
            return Math.sin(250 * Math.pow(x,1.5));
        },
        function () {
            var x = 5 * ((t % 1) + 1);
            return Math.sin(400 * Math.sin(Math.pow(x,1.5)));
        }
    ];
    return clips[Math.floor(t * 25) % clips.length]();
}).pipe(aplay.stdin);
