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
    var Polyline = /** @class */ (function () {
        function Polyline() {
            this.name = 'polyline';
        }
        Polyline.prototype.convertToPath = function (obj) {
            return this;
        };
        Polyline.prototype.getBox = function () {
            var xArr = this.points.map(function (p) { return p.x; });
            var yArr = this.points.map(function (p) { return p.y; });
            this.p1 = { x: Math.min(xArr), y: Math.min(yArr) };
            this.p2 = { x: Math.max(xArr), y: Math.max(yArr) };
            return this;
        };
        return Polyline;
    }());
    exports.Polyline = Polyline;
});
