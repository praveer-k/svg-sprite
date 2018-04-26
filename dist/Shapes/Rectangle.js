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
    var Rectangle = /** @class */ (function () {
        function Rectangle() {
            this.name = 'rectangle';
        }
        Rectangle.prototype.convertToPath = function (obj) {
            return this;
        };
        Rectangle.prototype.getBox = function () {
            this.p1 = { x: this.x, y: this.y };
            this.p2 = { x: this.x + this.width, y: this.y + this.height };
            return this;
        };
        return Rectangle;
    }());
    exports.Rectangle = Rectangle;
});
