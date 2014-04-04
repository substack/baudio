#!/usr/bin/env node
var path = require('path');
var fs = require('fs');
var vm = require('vm');
var minimist = require('minimist');
var parseDuration = require('parse-duration');
var baudio = require('../');

var argv = minimist(process.argv.slice(2), {
    alias: { i: 'infile', d: 'duration' }
});
var file = argv.i || argv._[0];

if (argv.h || argv.help) return usage(0);
if (!file) return usage(1);

var src = fs.readFileSync(file, 'utf8');
var ctx = { Buffer: Buffer, console: console };
var fn = vm.runInNewContext('(function(){'+src+'})()', ctx);

var duration = /^\d+$/.test(argv.d)
    ? parseInt(argv.d) * 1000
    : parseDuration(argv.d || '0')
;
var b = baudio(function (t, i) {
    if (duration && t * 1000 >= duration) b.end()
    return fn(t, i);
});

if (argv.o) b.record(argv.o)
else b.play()

function usage (code) {
    var s = fs.createReadStream(__dirname + '/usage.txt');
    s.pipe(code ? process.stderr : process.stdout);
    s.on('end', function () {
        if (code) process.exit(code);
    });
}
