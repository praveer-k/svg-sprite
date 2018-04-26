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
    var C = /** @class */ (function () {
        function C(instruction, point, currentPosition) {
            if (currentPosition === void 0) { currentPosition = { x: 0, y: 0 }; }
            if (instruction == 'c') {
                this.x1 = currentPosition.x + parseFloat(point[0]);
                this.y1 = currentPosition.y + parseFloat(point[1]);
                this.x2 = currentPosition.x + parseFloat(point[2]);
                this.y2 = currentPosition.y + parseFloat(point[3]);
                this.x = currentPosition.x + parseFloat(point[4]);
                this.y = currentPosition.y + parseFloat(point[5]);
            }
            else {
                this.x1 = parseFloat(point[0]);
                this.y1 = parseFloat(point[1]);
                this.x2 = parseFloat(point[2]);
                this.y2 = parseFloat(point[3]);
                this.x = parseFloat(point[4]);
                this.y = parseFloat(point[5]);
            }
            currentPosition.x = this.x;
            currentPosition.y = this.y;
        }
        C.prototype.toString = function () {
            return this.x1.toFixed(3) + ',' + this.y1.toFixed(3) + ' ' + this.x2.toFixed(3) + ',' + this.y2.toFixed(3) + ' ' + this.x.toFixed(3) + ',' + this.y.toFixed(3);
        };
        C.prototype.midpoint = function (x, y) {
            var m1x = (x + this.x1) / 2;
            var m1y = (y + this.y1) / 2;
            var m2x = (this.x1 + this.x2) / 2;
            var m2y = (this.y1 + this.y2) / 2;
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
        C.prototype.scale = function (factor) {
            this.x1 = this.x1 * factor;
            this.y1 = this.y1 * factor;
            this.x2 = this.x2 * factor;
            this.y2 = this.y2 * factor;
            this.x = this.x * factor;
            this.y = this.y * factor;
        };
        C.prototype.translate = function (x, y) {
            this.x1 += x;
            this.y1 += y;
            this.x2 += x;
            this.y2 += y;
            this.x += x;
            this.y += y;
        };
        return C;
    }());
    exports.C = C;
});
