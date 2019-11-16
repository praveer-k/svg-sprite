(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./svgobject"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var fs = require('fs');
    var builder = require('xmlbuilder');
    var path = require('path');
    var svgobject_1 = require("./svgobject");
    /*
        <svg>
        <use>
        <symbol>
        <title>
        <path>
            ...
            <rectangle>
            <circle>
            <ellipse>
            <line>
            <polygon>
            <polyline>
            <text>
    */
    var SVGSprite = /** @class */ (function () {
        function SVGSprite(filepath, options) {
            if (options === void 0) { options = { height: 32, width: 32, padding: 8 }; }
            this.sprite = builder.create('svg', { version: '1.0', encoding: 'UTF-8', standalone: true })
                .att({ version: '1.1', xmlns: 'http://www.w3.org/2000/svg',
                'xmlns:xlink': 'http://www.w3.org/1999/xlink' });
            this.svgs = [];
            this.options = options;
            this.walkSource(filepath);
        }
        SVGSprite.prototype.walkSource = function (filepath) {
            var objRef = this;
            if (fs.statSync(filepath).isDirectory()) {
                var files = fs.readdirSync(filepath);
                this.read(files, filepath);
            }
            else {
                if (path.extname(filepath) == '.svg') {
                    console.log(filepath);
                    objRef.svgs.push(new svgobject_1.SVGObject(filepath).standardise(objRef.options).getObject());
                }
            }
        };
        SVGSprite.prototype.read = function (files, filepath) {
            var objRef = this;
            files.forEach(function (file) {
                var fullPath = path.join(path.resolve(filepath), file);
                if (fs.statSync(fullPath).isDirectory()) {
                    objRef.walkSource(fullPath);
                }
                else {
                    if (path.extname(fullPath) == '.svg') {
                        var name = fullPath.substring(fullPath.lastIndexOf('/') + 1, fullPath.lastIndexOf('.'));
                        // if(name=='cloud-upload'){
                        console.log(fullPath);
                        objRef.svgs.push(new svgobject_1.SVGObject(fullPath).standardise(objRef.options).getObject());
                        // }
                    }
                }
            });
        };
        // end
        SVGSprite.prototype.addSVG = function (svgObj, viewBox) {
            if (viewBox === void 0) { viewBox = '0 0 48 48'; }
            var filename = svgObj.id;
            var svg = this.sprite.ele('svg', { viewBox: viewBox });
            var group = svg.ele('g', { id: filename, class: 'icon' });
            svgObj.children.map(function (obj) {
                group.ele('path', { d: obj.attributes.d, style: obj.attributes.style });
            });
            // group.ele('path',{ d: 'M0,0 L 48,0 48,48 0,48 Z M 0,24 L 24,24', style:'stroke: #ff0000; stroke-width:1; fill:none;' });
        };
        SVGSprite.prototype.addSymbol = function (svgObj, viewBox) {
            var filename = svgObj.id;
            this.sprite.ele('use', { 'xlink:href': '#' + filename });
            var symbol = this.sprite.ele('symbol', { viewBox: viewBox, id: filename });
            symbol.ele('title', filename);
            var group = symbol.ele('g');
            svgObj.children.map(function (obj, index) {
                group.ele('path', { d: obj.attributes.d, style: obj.attributes.style });
            });
            // group.ele('path',{ d: 'M0,0 L 48,0 48,48 0,48 Z M 0,24 L 24,24', style:'stroke: #ff0000; stroke-width:1; fill:none;' });
        };
        SVGSprite.prototype.addViewTranslate = function (svgObj, xy, wh) {
            var filename = svgObj.id;
            var viewBox = xy + ' ' + wh;
            this.sprite.ele('view', { id: filename, viewBox: viewBox });
            var group = this.sprite.ele('g', { transform: 'translate(' + xy + ')' });
            svgObj.children.map(function (obj, index) {
                group.ele('path', { d: obj.attributes.d, style: obj.attributes.style });
            });
            // group.ele('path',{ d: 'M0,0 L 48,0 48,48 0,48 Z M 0,24 L 24,24', style:'stroke: #ff0000; stroke-width:1; fill:none;' });
        };
        SVGSprite.prototype.generate = function (type) {
            var _this = this;
            if (type === void 0) { type = 'stacked'; }
            var x = 0;
            var y = 0;
            var width = this.options.width + this.options.padding * 2;
            var height = this.options.height + this.options.padding * 2;
            var total = this.svgs.length;
            var maxWidth = (Math.sqrt(total) % 1 !== 0) ? (parseInt(Math.sqrt(total).toFixed(0))) * width : Math.sqrt(total) * width;
            var maxHeight = (Math.sqrt(total) % 1 !== 0) ? (parseInt(Math.sqrt(total).toFixed(0)) + 1) * height : Math.sqrt(total) * height;
            var viewBox = '';
            switch (type) {
                case 'symbol':
                    viewBox = 0 + ' ' + 0 + ' ' + maxWidth + ' ' + maxHeight;
                    // this.sprite.att({ width: maxWidth, height: maxHeight, viewBox: viewBox, preserveAspectRatio: 'xMidYMid slice'});
                    this.svgs.map(function (svg, index) {
                        var viewBox = -x + ' ' + -y + ' ' + maxWidth + ' ' + maxHeight;
                        _this.addSymbol(svg, viewBox);
                        x += width;
                        if (x > maxWidth) {
                            x = 0;
                            y += height;
                        }
                    });
                    break;
                case 'viewtranslate':
                    viewBox = 0 + ' ' + 0 + ' ' + maxWidth + ' ' + maxHeight;
                    this.sprite.att({ width: maxWidth, height: maxHeight, viewBox: viewBox, preserveAspectRatio: 'xMidYMid slice' });
                    this.svgs.map(function (svg, index) {
                        var xy = x + ' ' + y;
                        var wh = width + ' ' + height;
                        _this.addViewTranslate(svg, xy, wh);
                        x += width;
                        if (x >= maxWidth) {
                            x = 0;
                            y += height;
                        }
                    });
                    break;
                case 'stacked':
                    var defs = this.sprite.ele('defs');
                    defs.ele('style', '\n svg .icon { display: none; } \n svg .icon:target { display: inline; } \n');
                    this.sprite.att({ class: 'icon' });
                    viewBox = 0 + ' ' + 0 + ' ' + width + ' ' + height;
                    this.svgs.map(function (svg) { _this.addSVG(svg, viewBox); });
                    break;
            }
            return this;
        };
        SVGSprite.prototype.write = function (desfile) {
            var xmldoc = this.sprite.toString({ pretty: true });
            fs.writeFile(desfile, xmldoc, function (err) {
                if (err)
                    throw err;
                console.log('The file ' + desfile + ' has been created successfully!');
            });
            return this;
        };
        SVGSprite.prototype.writeCSS = function (desfile) {
            var width = this.options.width + this.options.padding * 2;
            var height = this.options.height + this.options.padding * 2;
            var textDoc = '.icon {\n' +
                '    height: ' + width + 'px;\n' +
                '    width : ' + width + 'px;\n' +
                '    border: 1px solid #ff0000;\n' +
                '}\n';
            this.svgs.map(function (obj, index) {
                var name = obj.id;
                if (!isNaN(name[0])) {
                    name = '_' + name;
                }
                textDoc += '.' + name + '{ \n' +
                    '    background-image  : url("./sprites.svg#' + obj.id + '");\n' +
                    '    background-size   : ' + width + 'px ' + height + 'px;\n' +
                    '    background-repeat : no-repeat; \n' +
                    '}\n';
            });
            fs.writeFile(desfile, textDoc, function (err) {
                if (err)
                    throw err;
                console.log('The file ' + desfile + ' has been created successfully!');
            });
            return this;
        };
        return SVGSprite;
    }());
    exports.SVGSprite = SVGSprite;
});
