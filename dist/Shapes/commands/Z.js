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
    var Z = /** @class */ (function () {
        function Z() {
        }
        Z.prototype.toString = function () {
            return '';
        };
        Z.prototype.scale = function (factor) {
            // do nothing
        };
        Z.prototype.translate = function (x, y) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            // do nothing
        };
        return Z;
    }());
    exports.Z = Z;
});
