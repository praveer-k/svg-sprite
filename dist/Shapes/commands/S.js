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
    var S = /** @class */ (function () {
        function S(instruction, point, currentPosition) {
            if (currentPosition === void 0) { currentPosition = { x: 0, y: 0 }; }
            if (instruction == 's') {
                this.x2 = currentPosition.x + parseFloat(point[0]);
                this.y2 = currentPosition.y + parseFloat(point[1]);
                this.x = currentPosition.x + parseFloat(point[2]);
                this.y = currentPosition.y + parseFloat(point[3]);
            }
            else {
                this.x2 = parseFloat(point[0]);
                this.y2 = parseFloat(point[1]);
                this.x = parseFloat(point[2]);
                this.y = parseFloat(point[3]);
            }
            currentPosition.x = this.x;
            currentPosition.y = this.y;
        }
        S.prototype.toString = function () {
            return this.x2.toFixed(3) + ',' + this.y2.toFixed(3) + ' ' + this.x.toFixed(3) + ',' + this.y.toFixed(3);
        };
        S.prototype.midpoint = function (cpx, cpy, x, y) {
            var dx = Math.abs(Math.abs(x) - Math.abs(cpx));
            var dy = Math.abs(Math.abs(y) - Math.abs(cpy));
            var x1 = (cpx > x) ? x - dx : x + dx;
            var y1 = (cpy > y) ? y - dy : y + dy;
            // console.log('midpoint in S ', cpx, cpy, x, y, dx, dy, x1, y1);
            var m1x = (x + x1) / 2;
            var m1y = (y + y1) / 2;
            var m2x = (x1 + this.x2) / 2;
            var m2y = (y1 + this.y2) / 2;
            var m3x = (this.x + this.x2) / 2;
            var m3y = (this.y + this.y2) / 2;
            var m12x = (m1x + m2x) / 2;
            var m12y = (m1y + m2y) / 2;
            var m23x = (m2x + m3x) / 2;
            var m23y = (m2y + m3y) / 2;
            var mx = (m12x + m23x) / 2;
            var my = (m12y + m23y) / 2;
            return { x: mx, y: my };
        };
        S.prototype.scale = function (factor) {
            this.x2 = this.x2 * factor;
            this.y2 = this.y2 * factor;
            this.x = this.x * factor;
            this.y = this.y * factor;
        };
        S.prototype.translate = function (x, y) {
            this.x2 += x;
            this.y2 += y;
            this.x += x;
            this.y += y;
        };
        return S;
    }());
    exports.S = S;
});
