(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./Commands"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var inspect = require('util').inspect;
    var Commands_1 = require("./Commands");
    var Path = /** @class */ (function () {
        function Path() {
            this.name = 'path';
            this.attributes = {};
            this.attributes.d = '';
            this.attributes.style = '';
            this.objArr = [];
        }
        Path.prototype.convertToPath = function (obj) {
            this.relativePathToAbsolute(obj).combineCommands();
            this.attributes.style = (obj.attributes.style === undefined) ? '' : obj.attributes.style;
            return this;
        };
        Path.prototype.getBox = function () {
            var _this = this;
            this.p1 = { x: this.objArr[0].x, y: this.objArr[0].y };
            this.p2 = { x: this.objArr[0].x, y: this.objArr[0].y };
            var cur = { x: this.objArr[0].x, y: this.objArr[0].y };
            var dirx = NaN;
            var diry = NaN;
            this.objArr.map(function (obj, index) {
                switch (obj.constructor.name) {
                    case 'M':
                    case 'L':
                        if (_this.p1.x > obj.x) {
                            _this.p1.x = obj.x;
                        }
                        if (_this.p1.y > obj.y) {
                            _this.p1.y = obj.y;
                        }
                        if (_this.p2.x < obj.x) {
                            _this.p2.x = obj.x;
                        }
                        if (_this.p2.y < obj.y) {
                            _this.p2.y = obj.y;
                        }
                        cur.x = obj.x;
                        cur.y = obj.y;
                        break;
                    case 'H':
                        cur.x = obj.x;
                        if (_this.p1.x > obj.x) {
                            _this.p1.x = obj.x;
                        }
                        if (_this.p2.x < obj.x) {
                            _this.p2.x = obj.x;
                        }
                        break;
                    case 'V':
                        cur.y = obj.y;
                        if (_this.p1.y > obj.y) {
                            _this.p1.y = obj.y;
                        }
                        if (_this.p2.y < obj.y) {
                            _this.p2.y = obj.y;
                        }
                        break;
                    case 'C':
                        if (_this.p1.x > Math.min(cur.x, obj.x, obj.midpoint(cur.x, cur.y).x)) {
                            _this.p1.x = Math.min(cur.x, obj.x, obj.midpoint(cur.x, cur.y).x);
                        }
                        if (_this.p1.y > Math.min(cur.y, obj.y, obj.midpoint(cur.x, cur.y).y)) {
                            _this.p1.y = Math.min(cur.y, obj.y, obj.midpoint(cur.x, cur.y).y);
                        }
                        if (_this.p2.x < Math.max(cur.x, obj.x, obj.midpoint(cur.x, cur.y).x)) {
                            _this.p2.x = Math.max(cur.x, obj.x, obj.midpoint(cur.x, cur.y).x);
                        }
                        if (_this.p2.y < Math.max(cur.y, obj.y, obj.midpoint(cur.x, cur.y).y)) {
                            _this.p2.y = Math.max(cur.y, obj.y, obj.midpoint(cur.x, cur.y).y);
                        }
                        cur.x = obj.x;
                        cur.y = obj.y;
                        dirx = obj.x2;
                        diry = obj.y2;
                        break;
                    case 'S':
                        var sx = obj.midpoint(cur.x, cur.y, dirx, diry).x;
                        var sy = obj.midpoint(cur.x, cur.y, dirx, diry).y;
                        if (_this.p1.x > Math.min(cur.x, obj.x, sx)) {
                            _this.p1.x = Math.min(cur.x, obj.x, sx);
                        }
                        if (_this.p1.y > Math.min(cur.y, obj.y, sy)) {
                            _this.p1.y = Math.min(cur.y, obj.y, sy);
                        }
                        if (_this.p2.x < Math.max(cur.x, obj.x, sx)) {
                            _this.p2.x = Math.max(cur.x, obj.x, sx);
                        }
                        if (_this.p2.y < Math.max(cur.y, obj.y, sy)) {
                            _this.p2.y = Math.max(cur.y, obj.y, sy);
                        }
                        cur.x = obj.x;
                        cur.y = obj.y;
                        dirx = obj.x2;
                        diry = obj.y2;
                        break;
                    case 'Q':
                        if (_this.p1.x > Math.min(cur.x, obj.x, obj.midpoint(cur.x, cur.y).x)) {
                            _this.p1.x = Math.min(cur.x, obj.x, obj.midpoint(cur.x, cur.y).x);
                        }
                        if (_this.p1.y > Math.min(cur.y, obj.y, obj.midpoint(cur.x, cur.y).y)) {
                            _this.p1.y = Math.min(cur.y, obj.y, obj.midpoint(cur.x, cur.y).y);
                        }
                        if (_this.p2.x < Math.max(cur.x, obj.x, obj.midpoint(cur.x, cur.y).x)) {
                            _this.p2.x = Math.max(cur.x, obj.x, obj.midpoint(cur.x, cur.y).x);
                        }
                        if (_this.p2.y < Math.max(cur.y, obj.y, obj.midpoint(cur.x, cur.y).y)) {
                            _this.p2.y = Math.max(cur.y, obj.y, obj.midpoint(cur.x, cur.y).y);
                        }
                        cur.x = obj.x;
                        cur.y = obj.y;
                        dirx = obj.x1;
                        diry = obj.y1;
                        break;
                    case 'T':
                        var tx = obj.midpoint(cur.x, cur.y, dirx, diry).x;
                        var ty = obj.midpoint(cur.x, cur.y, dirx, diry).y;
                        if (_this.p1.x > Math.min(cur.x, obj.x, tx)) {
                            _this.p1.x = Math.min(cur.x, obj.x, tx);
                        }
                        if (_this.p1.y > Math.min(cur.y, obj.y, ty)) {
                            _this.p1.y = Math.min(cur.y, obj.y, ty);
                        }
                        if (_this.p2.x < Math.max(cur.x, obj.x, tx)) {
                            _this.p2.x = Math.max(cur.x, obj.x, tx);
                        }
                        if (_this.p2.y < Math.max(cur.y, obj.y, ty)) {
                            _this.p2.y = Math.max(cur.y, obj.y, ty);
                        }
                        cur.x = obj.x;
                        cur.y = obj.y;
                        break;
                    case 'A':
                        // ignoring the flags to accomodate only circles
                        _this.p1.x = Math.min(cur.x, obj.x);
                        _this.p1.y = Math.min(cur.y, obj.y);
                        _this.p2.x = Math.max(cur.x, obj.x);
                        _this.p2.y = Math.max(cur.y, obj.y);
                        cur.x = obj.x;
                        cur.y = obj.y;
                        break;
                }
                // console.log(obj.constructor.name, inspect([this.p1,this.p2],true, Infinity));
            });
            this.p1.x = this.p1.x;
            this.p1.y = this.p1.y;
            this.p2.x = this.p2.x;
            this.p2.y = this.p2.y;
            // console.log(inspect([this.p1,this.p2],true, Infinity));
            return this;
        };
        Path.prototype.relativePathToAbsolute = function (obj) {
            var res = obj.attributes.d.replace(/([a-zA-Z])/g, "|$1");
            // console.log(res);
            res = (res[0] == '|') ? res.substr(1) : res;
            var steps = [];
            var currentPosition = { x: 0, y: 0 }; // pass by reference so coordinates traverse.
            res.split('|').map(function (cmdString, index) {
                var cmd = new Commands_1.Command(cmdString, currentPosition);
                cmd.all.map(function (c) { steps.push(c); });
            });
            // console.log(inspect(steps, { color: true, depth: Infinity }));
            this.objArr = steps;
            return this;
        };
        Path.prototype.combineCommands = function () {
            var path = '';
            this.objArr.map(function (obj, i) {
                // console.log(obj.constructor.name);
                path += obj.constructor.name + ' ' + obj.toString() + ' ';
            });
            // console.log(path);
            this.attributes.d = path.trim();
            return this;
        };
        Path.prototype.scale = function (factor) {
            this.objArr.map(function (obj, index) {
                // console.log(inspect(obj, true, Infinity));
                obj.scale(factor);
            });
            return this;
        };
        Path.prototype.translate = function (x, y) {
            this.objArr.map(function (obj, index) {
                // console.log(inspect(obj, true, Infinity));
                obj.translate(x, y);
            });
            return this;
        };
        return Path;
    }());
    exports.Path = Path;
});
