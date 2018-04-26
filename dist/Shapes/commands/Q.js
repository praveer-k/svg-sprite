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
    var Q = /** @class */ (function () {
        function Q(instruction, point, currentPosition) {
            if (currentPosition === void 0) { currentPosition = { x: 0, y: 0 }; }
            if (instruction == 'q') {
                this.x1 = currentPosition.x + parseFloat(point[0]);
                this.y1 = currentPosition.y + parseFloat(point[1]);
                this.x = currentPosition.x + parseFloat(point[2]);
                this.y = currentPosition.y + parseFloat(point[3]);
            }
            else {
                this.x1 = parseFloat(point[0]);
                this.y1 = parseFloat(point[1]);
                this.x = parseFloat(point[2]);
                this.y = parseFloat(point[3]);
            }
            currentPosition.x = this.x;
            currentPosition.y = this.y;
        }
        Q.prototype.toString = function () {
            return this.x1.toFixed(3) + ',' + this.y1.toFixed(3) + ' ' + this.x.toFixed(3) + ',' + this.y.toFixed(3);
        };
        Q.prototype.midpoint = function (x, y) {
            var m1x = (x + this.x1) / 2;
            var m1y = (y + this.y1) / 2;
            var m2x = (this.x + this.x1) / 2;
            var m2y = (this.y + this.y1) / 2;
            var mx = (m1x + m2x) / 2;
            var my = (m1y + m2y) / 2;
            return { x: mx, y: my };
        };
        Q.prototype.scale = function (factor) {
            this.x1 = this.x1 * factor;
            this.y1 = this.y1 * factor;
            this.x = this.x * factor;
            this.y = this.y * factor;
        };
        Q.prototype.translate = function (x, y) {
            this.x1 += x;
            this.y1 += y;
            this.x += x;
            this.y += y;
        };
        return Q;
    }());
    exports.Q = Q;
});
