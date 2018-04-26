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
    var Ellipse = /** @class */ (function () {
        function Ellipse() {
            this.name = 'ellipse';
        }
        Ellipse.prototype.convertToPath = function (obj) {
            return this;
        };
        Ellipse.prototype.getBox = function () {
            this.p1 = { x: this.cx - this.rx, y: this.cy - this.ry };
            this.p2 = { x: this.cx + this.rx, y: this.cy + this.ry };
            return this;
        };
        return Ellipse;
    }());
    exports.Ellipse = Ellipse;
});
