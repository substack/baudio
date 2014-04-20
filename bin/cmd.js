#!/usr/bin/env node
var path = require('path');
var fs = require('fs');
var vm = require('vm');
var minimist = require('minimist');
var parseDuration = require('parse-duration');
var concat = require('concat-stream');
var check = require('syntax-error');
var baudio = require('../');

var argv = minimist(process.argv.slice(2), {
    alias: {
        i: 'infile', d: 'duration', t: 'offset', f: 'fade',
        r: 'rate'
    }
});
var file = argv.i || argv._[0];

if (argv.h || argv.help) usage(0);
else if (!file) {
    process.stdin.pipe(concat(function (body) {
        fromSource(body.toString('utf8'));
    }));
}
else fromSource(fs.readFileSync(file, 'utf8'));

function fromSource (src) {
    var ctx = { Buffer: Buffer, console: console };
    var err = check(src, file || '[stdin]');
    if (err) {
        console.error(err);
        return process.exit(1);
    }
    
    var fn = vm.runInNewContext('(function(){'+src+'})()', ctx);
    if (typeof fn !== 'function') {
        console.error('source code return value was not a function.');
        console.error('expected: function, actual: ' + typeof fn);
        return process.exit(1);
    }
    
    var duration = /^(\.\d+|\d+|\d+\.\d*)$/.test(argv.d)
        ? parseFloat(argv.d) * 1000
        : parseDuration(argv.d || '0')
    ;
    var fade = /^(\.\d+|\d+|\d+\.\d*)$/.test(argv.f)
        ? parseFloat(argv.f) * 1000
        : parseDuration(argv.f || '0')
    ;
    var offset = /^(\.\d+|\d+|\d+\.\d*)$/.test(argv.t)
        ? parseFloat(argv.t) * 1000
        : parseDuration(argv.t || '0')
    ;
    var opts = { rate: argv.rate };
    if (opts.rate) opts.rate = opts.rate.replace(/k$/i, '000');;
    if (opts.rate) opts.rate = opts.rate.replace(/hz$/i, '');;
    
    var b = baudio(opts, function (t, i) {
        if (duration && t * 1000 >= duration) b.end()
        t += offset;
        var res = fn(t, i);
        if (fade && duration - t * 1000 <= fade) {
            res *= Math.max(0, (duration - t * 1000) / fade);
        }
        return res;
    });
    b.on('error', function (err) {
        console.error(err.message || err);
        process.exit(1);
    });
    
    if (argv.o === '-') b.pipe(process.stdout)
    else if (argv.o) b.record(argv.o)
    else b.play()
}

function usage (code) {
    var s = fs.createReadStream(__dirname + '/usage.txt');
    s.pipe(code ? process.stderr : process.stdout);
    s.on('end', function () {
        if (code) process.exit(code);
    });
}
