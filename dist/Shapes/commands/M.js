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
    var M = /** @class */ (function () {
        function M(instruction, point, currentPosition) {
            if (currentPosition === void 0) { currentPosition = { x: 0, y: 0 }; }
            if (instruction == 'm') {
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
        M.prototype.toString = function () {
            return this.x.toFixed(3) + ',' + this.y.toFixed(3);
        };
        M.prototype.scale = function (factor) {
            this.x = this.x * factor;
            this.y = this.y * factor;
        };
        M.prototype.translate = function (x, y) {
            this.x += x;
            this.y += y;
        };
        return M;
    }());
    exports.M = M;
});
