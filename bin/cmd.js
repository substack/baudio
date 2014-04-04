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
    alias: { i: 'infile', d: 'duration' }
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
    
    var duration = /^\d+$/.test(argv.d)
        ? parseInt(argv.d) * 1000
        : parseDuration(argv.d || '0')
    ;
    var b = baudio(function (t, i) {
        if (duration && t * 1000 >= duration) b.end()
        return fn(t, i);
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
