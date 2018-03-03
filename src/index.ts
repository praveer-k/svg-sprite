const fs = require('fs');
const parse = require('xml-parser');
const builder = require('xmlbuilder');
const path = require('path');
const inspect = require('util').inspect;

import { SVG } from './SVG';
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
class StandardiseSVG {
    sprite: any;
    options: any;
    svgs: any;
    constructor(filepath: string, options={ height:32, width:32, padding:8 }){ 
        this.sprite = builder.create('svg', {version: '1.0', encoding: 'UTF-8', standalone: true})
                             .att({ version: '1.1', xmlns: 'http://www.w3.org/2000/svg',
                                    'xmlns:xlink': 'http://www.w3.org/1999/xlink'});
        this.svgs = [];
        this.options = options;
        this.walkSource(filepath);
        //console.log(inspect(this.svgs, { colors: true, depth: Infinity }));
    }
    private walkSource(filepath: string): void{
        let files = fs.readdirSync(filepath);
        this.read(files, filepath);
    }
    private read(files: any, filepath: string): any{
        const objRef = this;
        files.forEach(file => {
            const fullPath = path.join(path.resolve(filepath), file);
            if( fs.statSync(fullPath).isDirectory() ){
                objRef.walkSource(fullPath);
            } else {
                if(path.extname(fullPath) == '.svg') {
                    let svg = new SVG(fullPath);
                    svg.standardise(objRef.options);
                    objRef.svgs.push(svg.getObject());
                }
            }
        });
    }
    // end
    private addSVGToSprite(svgObj: any, viewBox='0 0 48 48'): void{
        var filename = svgObj.id;
        this.sprite.ele('use', { 'xlink:href' : '#' + filename });
        var symbol = this.sprite.ele('symbol', { 'id' : filename, 'viewBox' : viewBox });
        symbol.ele('title', filename);
        svgObj.children.map((obj, index) => {
            symbol.ele('path', { d: obj.attributes.d, style: obj.attributes.style });
        });
    }
    public generate(): StandardiseSVG{
        let x = 0;
        let y = 0;
        let width = this.options.width + this.options.padding * 2;
        let height = this.options.height + this.options.padding * 2;
        let total = this.svgs.length;
        let maxWidth = Math.floor(Math.sqrt(total)) * width;
        // let maxHeight = Math.ceil(Math.sqrt(total)) * height;
        // console.log(total, maxWidth, maxHeight, width, height, x, y);
        this.svgs.map((svg, index) => {
            let viewBox = x + ' ' + y + ' ' + width + ' ' + height;
            this.addSVGToSprite(svg, viewBox);
            x += width;
            if (x > maxWidth) {
                x = 0;
                y += height;
            }
        });
        return this;
    }
    public write(desfile){
        var xmldoc = this.sprite.toString({ pretty: true });
        xmldoc = '<?xml version="1.0"?>\n' +
                 '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"\n' +
                 '"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n' +
                  xmldoc;
        //console.log(xmldoc);
        fs.writeFile(desfile, xmldoc, (err) => {
            if (err) throw err;
            console.log('The file ' + desfile + ' has been created successfully!');
        });
    }
}

const svg = new StandardiseSVG('./src/light/');
svg.generate().write('./src/sprites.svg');