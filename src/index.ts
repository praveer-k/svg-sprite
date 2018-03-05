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
        var defs = this.sprite.ele('defs');
        defs.ele('style', '\n svg .icon { display: none; } \n svg .icon:target { display: inline; } \n');
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
    private addSVGToSprite(svgObj: any, standardViewBox='0 0 48 48', viewBox='0 0 48 48'): void{
        var filename = svgObj.id;
        // this.sprite.ele('view', { id: filename, viewBox: standardViewBox });
        // this.sprite.ele('use', { 'xlink:href' : '#' + filename });
        var symbol = this.sprite.ele('svg', { viewBox : viewBox });
        // symbol.ele('title', filename);
        var group = symbol.ele('g', {id : filename, class: 'icon'});
        svgObj.children.map((obj, index) => {
            group.ele('path', { d: obj.attributes.d, style: obj.attributes.style });
        });
    }
    public generate(): StandardiseSVG{
        let x = 0;
        let y = 0;
        let width = this.options.width + this.options.padding * 2;
        let height = this.options.height + this.options.padding * 2;
        let total = this.svgs.length;
        let maxWidth = Math.floor(Math.sqrt(total)) * width;
        let maxHeight = Math.ceil(Math.sqrt(total)) * height;
        let viewBox = x + ' ' + y + ' ' + maxWidth + ' ' + maxHeight;
        this.sprite.att({ class: 'icon' });
        // this.sprite.att({ width: maxWidth, height: maxHeight, viewBox: viewBox, preserveAspectRatio: 'xMidYMid slice'});
        // console.log(total, maxWidth, maxHeight, width, height, x, y);
        this.svgs.map((svg, index) => {
            let standardViewBox = -x + ' ' + -y + ' ' + maxWidth + ' ' + maxHeight;
            let viewBox = 0 + ' ' + 0 + ' ' + width + ' ' + height;
            this.addSVGToSprite(svg, standardViewBox, viewBox);
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
        /*xmldoc = '<?xml version="1.0"?>\n' +
                 '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"\n' +
                 '"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n' +
                  xmldoc; */
        //console.log(xmldoc);
        fs.writeFile(desfile, xmldoc, (err) => {
            if (err) throw err;
            console.log('The file ' + desfile + ' has been created successfully!');
        });
    }
}

const svg = new StandardiseSVG('./src/light/');
svg.generate().write('./src/sprites.svg');