var baudio = require('../');
var b = baudio();

b.push((function () {
    // randomly evolving melody
    
    var freqs = [
        0, 0, 1600, 1600,
        0, 0, 2000, 2000,
        0, 1400, 0, 1400,
        0, 1600, 0, 1800
    ];
    function mutate () {
        var xs = freqs.slice();
        var ix = Math.floor(Math.random() * xs.length);
        
        xs[ix] = Math.max(
            0,
            xs[ix] + ((Math.floor(Math.random() * 2) - 1) * 2 + 1) * 400
        );
        return xs;
    }
    
    var loop = 0;
    return function (t) {
        var n = Math.floor((t * 4) / freqs.length);
        if (loop !== n) {
            loop = n;
            freqs = mutate(freqs);
            
            console.log('iteration ' + loop);
            console.log('  ' + JSON.stringify(freqs));
        }
        
        var f = freqs[Math.floor((t * 4) % freqs.length)];
        return Math.sin(t * Math.PI * f);
    }
})());

b.push(function (t, i) {
    // baseline
    var f = 800 * Math.pow(2, Math.floor(t * 4 % 4) / 6);
    return Math.sin(t * f * Math.PI)
        * Math.pow(Math.sin(t * 8 * Math.PI), 2)
    ;
});

b.push((function () {
    // drums
    var n = 0;
    return function (t, i) {
        if (i % 10 === 0) n = Math.random();
        
        return t * 2 % 1/16 < 1/256
            || (t * 2 / 32) % 1/16 < 1 / 256
            || (t * 2 / 32) % 1/16 < 1 / 256
            ? n : 0
        ;
    };
})());

b.play();
