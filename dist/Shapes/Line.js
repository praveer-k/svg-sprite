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
    var Line = /** @class */ (function () {
        function Line() {
            this.name = 'line';
        }
        Line.prototype.convertToPath = function (obj) {
            return this;
        };
        Line.prototype.getBox = function () {
            var x1 = Math.min(this.x1, this.x2);
            var y1 = Math.min(this.y1, this.y2);
            var x2 = Math.max(this.x1, this.x2);
            var y2 = Math.max(this.y1, this.y2);
            this.p1 = { x: x1, y: y1 };
            this.p2 = { x: x2, y: y2 };
            return this;
        };
        return Line;
    }());
    exports.Line = Line;
});
