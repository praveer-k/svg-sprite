(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./Rectangle", "./Circle", "./Text", "./Path"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Rectangle_1 = require("./Rectangle");
    var Circle_1 = require("./Circle");
    // import './Line';
    // import './Polygon';
    // import './Polyline';
    var Text_1 = require("./Text");
    var Path_1 = require("./Path");
    var Shapes = /** @class */ (function () {
        function Shapes() {
        }
        Shapes.prototype.getShape = function (shapeName) {
            var shape;
            switch (shapeName.toLowerCase()) {
                case 'rectangle':
                    shape = new Rectangle_1.Rectangle();
                    break;
                case 'circle':
                    shape = new Circle_1.Circle();
                    break;
                case 'ellipse':
                    shape = new Circle_1.Circle();
                    break;
                case 'text':
                    shape = new Text_1.Text();
                    break;
                case 'path':
                    shape = new Path_1.Path();
                    break;
            }
            return shape;
        };
        return Shapes;
    }());
    exports.Shapes = Shapes;
});
