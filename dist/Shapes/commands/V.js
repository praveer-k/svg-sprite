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
    var V = /** @class */ (function () {
        function V(instruction, point, currentPosition) {
            if (currentPosition === void 0) { currentPosition = { x: 0, y: 0 }; }
            if (instruction == 'v') {
                this.y = currentPosition.y + parseFloat(point[0]);
            }
            else {
                this.y = parseFloat(point[0]);
            }
            currentPosition.y = this.y;
        }
        V.prototype.toString = function () {
            return this.y.toFixed(3);
        };
        V.prototype.scale = function (factor) {
            this.y = this.y * factor;
        };
        V.prototype.translate = function (x, y) {
            if (x === void 0) { x = 0; }
            this.y += y;
        };
        return V;
    }());
    exports.V = V;
});
