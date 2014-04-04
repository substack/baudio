#!/usr/bin/env node
var path = require('path');
var fs = require('fs');
var vm = require('vm');
var baudio = require('../');

var src = fs.readFileSync(process.argv[2], 'utf8');
var ctx = { Buffer: Buffer, console: console };
var fn = vm.runInNewContext('(function(){'+src+'})()', ctx);

var b = baudio(fn);
b.play();
