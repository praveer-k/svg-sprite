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
    var Text = /** @class */ (function () {
        function Text() {
            this.name = 'text';
        }
        Text.prototype.convertToPath = function (obj) {
            return this;
        };
        Text.prototype.getBox = function () {
            return this;
        };
        return Text;
    }());
    exports.Text = Text;
});
