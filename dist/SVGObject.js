(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./shapes/shapes"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var fs = require('fs');
    var path = require('path');
    var inspect = require('util').inspect;
    var fastXmlParser = require('fast-xml-parser');
    var builder = require('xmlbuilder');
    var shapes_1 = require("./shapes/shapes");
    var SVGObject = /** @class */ (function () {
        function SVGObject(filepath) {
            // viewbox
            this.shapes = new shapes_1.Shapes();
            this.readfile(filepath);
        }
        SVGObject.prototype.getObject = function () {
            return this.obj;
        };
        SVGObject.prototype.standardise = function (options) {
            var drawTags = this.findShapeTags();
            // console.log(inspect(drawTags, { colors: true, depth: Infinity }));
            var paths = this.convertToPaths(drawTags);
            paths = this.scalePathsToViewBox(paths, options);
            this.obj = { name: 'svg',
                attributes: { version: '1.1',
                    xmlns: 'http://www.w3.org/2000/svg',
                    'xmlns:xlink': 'http://www.w3.org/1999/xlink' },
                id: this.name,
                children: paths };
            return this;
        };
        // Private
        SVGObject.prototype.readfile = function (filepath) {
            this.name = filepath.substring(filepath.lastIndexOf('/') + 1, filepath.lastIndexOf('.'));
            var xml = fs.readFileSync(filepath, 'utf8');
            var options = {
                attributeNamePrefix: '',
                attrNodeName: 'attributes',
                ignoreAttributes: false,
                ignoreNameSpace: false,
                trimValues: true
            };
            this.obj = fastXmlParser.parse(xml, options);
            // console.log(inspect(this.obj, { colors: true, depth: Infinity }));
            if (Object.keys(this.obj)[0] !== 'svg') {
                throw Error('Given xml object is not of SVG type...');
            }
        };
        SVGObject.prototype.findShapeTags = function (children, tags) {
            var _this = this;
            if (children === void 0) { children = this.obj; }
            if (tags === void 0) { tags = []; }
            // when object is of type array then name = index
            Object.keys(children).map(function (name) {
                if (typeof (children[name]) === 'object' && (name == 'path' || name == 'rectangle' || name == 'circle' || name == 'ellipse' || name == 'line' || name == 'polygon' || name == 'polyline' || name == 'text')) {
                    if (children[name] instanceof Array) {
                        children[name].map(function (path) {
                            tags.push({ name: name, attributes: path.attributes });
                        });
                    }
                    else {
                        tags.push({ name: name, attributes: children[name].attributes });
                    }
                }
                else if (typeof (children[name]) === 'object') {
                    _this.findShapeTags(children[name], tags);
                }
            });
            return tags;
        };
        SVGObject.prototype.convertToPaths = function (tags) {
            var _this = this;
            var paths = [];
            tags.map(function (obj, index) {
                if (obj.name == 'path' || obj.name == 'circle') {
                    var shape = _this.shapes.getShape(obj.name);
                    var newObj = shape.convertToPath(obj).getBox();
                    paths.push(newObj);
                }
            });
            // console.log(inspect(paths, true, Infinity));
            return paths;
        };
        SVGObject.prototype.scalePathsToViewBox = function (paths, options) {
            var d = '';
            var p1 = { x: 0, y: 0 };
            var p2 = { x: 0, y: 0 };
            paths.map(function (path, index) {
                // console.log(inspect(path, true, Infinity));
                if (index == 0) {
                    p1 = JSON.parse(JSON.stringify(path.p1));
                    p2 = JSON.parse(JSON.stringify(path.p2));
                }
                else {
                    if (p1.x > path.p1.x) {
                        p1.x = JSON.parse(JSON.stringify(path.p1.x));
                    }
                    if (p1.y > path.p1.y) {
                        p1.y = JSON.parse(JSON.stringify(path.p1.y));
                    }
                    if (p2.x < path.p2.x) {
                        p2.x = JSON.parse(JSON.stringify(path.p2.x));
                    }
                    if (p2.y < path.p2.y) {
                        p2.y = JSON.parse(JSON.stringify(path.p2.y));
                    }
                }
            });
            var bounds = { width: p2.x - p1.x, height: p2.y - p1.y };
            // to maintain aspect ratio choose the higher value between the two
            var size = Math.max(bounds.width, bounds.height);
            var boxSize = Math.max(options.width, options.height);
            var factor = boxSize / size;
            var xdiff = (size - bounds.width) * factor * 0.5;
            var ydiff = (size - bounds.height) * factor * 0.5;
            var xpad = options.padding + xdiff;
            var ypad = options.padding + ydiff;
            console.log(size.toPrecision(2), boxSize.toPrecision(2), factor.toPrecision(2), xpad.toPrecision(2), ypad.toPrecision(2));
            paths.map(function (path, index) {
                path.translate(-p1.x, -p1.y).scale(factor).translate(xpad, ypad).combineCommands();
            });
            // console.log(inspect(paths, true, Infinity));
            return paths;
        };
        return SVGObject;
    }());
    exports.SVGObject = SVGObject;
});
