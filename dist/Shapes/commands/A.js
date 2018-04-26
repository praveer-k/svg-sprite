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
    var A = /** @class */ (function () {
        function A(instruction, point, currentPosition) {
            if (currentPosition === void 0) { currentPosition = { x: 0, y: 0 }; }
            this.rx = parseFloat(point[0]);
            this.ry = parseFloat(point[1]);
            this.xar = parseFloat(point[2]);
            this.laf = parseFloat(point[3]);
            this.sf = parseFloat(point[4]);
            if (instruction == 'a') {
                this.x = currentPosition.x + parseFloat(point[5]);
                this.y = currentPosition.y + parseFloat(point[6]);
            }
            else {
                this.x = parseFloat(point[5]);
                this.y = parseFloat(point[6]);
            }
            currentPosition.x = this.x;
            currentPosition.y = this.y;
        }
        A.prototype.toString = function () {
            return this.rx.toFixed(3) + ',' + this.ry.toFixed(3) + ' ' + this.xar + ' ' + this.laf + ' ' + this.sf + ' ' + this.x.toFixed(3) + ',' + this.y.toFixed(3);
        };
        A.prototype.scale = function (factor) {
            this.rx = this.rx * factor / 2;
            this.ry = this.ry * factor / 2;
            this.x = this.x * factor;
            this.y = this.y * factor;
        };
        A.prototype.translate = function (x, y) {
            this.x += x;
            this.y += y;
        };
        return A;
    }());
    exports.A = A;
});
