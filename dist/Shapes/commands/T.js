(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var T = /** @class */ (function () {
        function T(instruction, point, currentPosition) {
            if (currentPosition === void 0) { currentPosition = { x: 0, y: 0 }; }
            if (instruction == 't') {
                this.x = currentPosition.x + parseFloat(point[0]);
                this.y = currentPosition.y + parseFloat(point[1]);
            }
            else {
                this.x = parseFloat(point[0]);
                this.y = parseFloat(point[1]);
            }
            currentPosition.x = this.x;
            currentPosition.y = this.y;
        }
        T.prototype.toString = function () {
            return this.x.toFixed(3) + ',' + this.y.toFixed(3);
        };
        T.prototype.midpoint = function (cpx, cpy, x, y) {
            var dx = Math.abs(Math.abs(x) - Math.abs(cpx));
            var dy = Math.abs(Math.abs(y) - Math.abs(cpy));
            var x1 = (cpx > x) ? x - dx : x + dx;
            var y1 = (cpy > y) ? y - dy : y + dy;
            var m1x = (x + x1) / 2;
            var m1y = (y + y1) / 2;
            var m2x = (this.x + x1) / 2;
            var m2y = (this.y + y1) / 2;
            var mx = (m1x + m2x) / 2;
            var my = (m1y + m2y) / 2;
            return { x: mx, y: my };
        };
        T.prototype.scale = function (factor) {
            this.x = this.x * factor;
            this.y = this.y * factor;
        };
        T.prototype.translate = function (x, y) {
            this.x += x;
            this.y += y;
        };
        return T;
    }());
    exports.T = T;
});
