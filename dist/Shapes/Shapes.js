(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./rectangle", "./circle", "./text", "./path"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var rectangle_1 = require("./rectangle");
    var circle_1 = require("./circle");
    // import './Line';
    // import './Polygon';
    // import './Polyline';
    var text_1 = require("./text");
    var path_1 = require("./path");
    var Shapes = /** @class */ (function () {
        function Shapes() {
        }
        Shapes.prototype.getShape = function (shapeName) {
            var shape;
            switch (shapeName.toLowerCase()) {
                case 'rectangle':
                    shape = new rectangle_1.Rectangle();
                    break;
                case 'circle':
                    shape = new circle_1.Circle();
                    break;
                case 'ellipse':
                    shape = new circle_1.Circle();
                    break;
                case 'text':
                    shape = new text_1.Text();
                    break;
                case 'path':
                    shape = new path_1.Path();
                    break;
            }
            return shape;
        };
        return Shapes;
    }());
    exports.Shapes = Shapes;
});
