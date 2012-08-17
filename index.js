var Stream = require('stream');
var inherits = require('inherits');

module.exports = function (opts, fn) {
    if (typeof opts === 'function') {
        fn = opts;
        opts = {};
    }
    if (!opts) opts = {};
    var b = new B (opts);
    if (typeof fn === 'function') b.push(fn);
    return b;
};

function B (opts) {
    var self = this;
    Stream.call(self);
    
    self.readable = true;
    self.size = opts.size || 2048;
    self.rate = opts.rate || 44000;
    
    self.channels = [];
    self.t = 0;
    self.i = 0;
    
    process.nextTick(function () {
        if (self.paused) {
            self.on('resume', self.loop.bind(self));
        }
        else self.loop();
    });
}

inherits(B, Stream);

B.prototype.end = function () {
    this.ended = true;
};

B.prototype.destroy = function () {
    this.destroyed = true;
    this.emit('end');
};

B.prototype.pause = function () {
    this.paused = true;
};

B.prototype.resume = function () {
    if (!this.paused) return;
    this.paused = false;
};

B.prototype.push = function (fn) {
    this.channels.push(fn);
};

B.prototype.loop = function () {
    var self = this;
    
    var buf = self.tick();
    
    if (self.destroyed) {
        // no more events
    }
    else if (self.paused) {
        self.once('resume', function () {
            self.emit('data', buf);
            process.nextTick(self.loop.bind(self));
        });
    }
    else {
        self.emit('data', buf);
        if (self.ended) self.emit('end');
        else process.nextTick(self.loop.bind(self));
    }
};

B.prototype.tick = function () {
    var self = this;
    
    var buf = new Buffer(self.size);
    for (var i = 0; i <= self.size - 2; i += 2) {
        self.channels.forEach(function (ch) {
            var n = ch.call(self, self.t, self.i);
            buf.writeInt16LE(signed(n), i);
        });
        self.i ++;
        self.t += 1 / self.rate;
    }
    return buf;
};

function signed (n) {
    if (isNaN(n)) return 0;
    var b = Math.pow(2, 15);
    var x = n === -1 ? -1 : n % 1;
    return n > 0
        ? Math.floor((b * x) - 1)
        : Math.ceil((b * x) - 1)
    ;
}
