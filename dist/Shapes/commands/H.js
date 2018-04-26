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
    var H = /** @class */ (function () {
        function H(instruction, point, currentPosition) {
            if (currentPosition === void 0) { currentPosition = { x: 0, y: 0 }; }
            if (instruction == 'h') {
                this.x = currentPosition.x + parseFloat(point[0]);
            }
            else {
                this.x = parseFloat(point[0]);
            }
            currentPosition.x = this.x;
        }
        H.prototype.toString = function () {
            return this.x.toFixed(3);
        };
        H.prototype.scale = function (factor) {
            this.x = this.x * factor;
        };
        H.prototype.translate = function (x, y) {
            if (y === void 0) { y = 0; }
            this.x += x;
        };
        return H;
    }());
    exports.H = H;
});
