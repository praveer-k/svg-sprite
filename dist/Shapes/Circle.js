(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./commands", "./path"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var commands_1 = require("./commands");
    var path_1 = require("./path");
    var Circle = /** @class */ (function () {
        function Circle() {
            this.name = 'circle';
        }
        Circle.prototype.convertToPath = function (obj) {
            this.cx = parseFloat(obj.attributes.cx);
            this.cy = parseFloat(obj.attributes.cy);
            this.r = parseFloat(obj.attributes.r);
            var m = new commands_1.M('M', [this.cx - this.r, this.cy]);
            var a1 = new commands_1.A('A', [this.r, this.r, 0, 0, 0, this.cx + this.r, this.cy]);
            var a2 = new commands_1.A('A', [this.r, this.r, 0, 0, 0, this.cx - this.r, this.cy]);
            var d = [
                'M ' + m.toString(),
                'A ' + a1.toString(),
                'A ' + a2.toString(),
                'Z'
            ].join(' ');
            var newObj = { 'name': 'path',
                'attributes': {
                    'd': d,
                    'style': (obj.attributes.style === undefined) ? '' : obj.attributes.style
                }
            };
            // console.log(newObj);
            var p = new path_1.Path().convertToPath(newObj);
            return p;
        };
        Circle.prototype.getBox = function () {
            this.p1 = { x: this.cx - this.r, y: this.cy - this.r };
            this.p2 = { x: this.cx + this.r, y: this.cy + this.r };
            return this;
        };
        return Circle;
    }());
    exports.Circle = Circle;
});
