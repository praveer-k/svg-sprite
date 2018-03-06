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
    private addSVG(svgObj: any, viewBox='0 0 48 48'): void{
        var filename = svgObj.id;
        var svg = this.sprite.ele('svg', { viewBox : viewBox });
        var group = svg.ele('g', {id : filename, class: 'icon'});
        svgObj.children.map((obj) => {
            group.ele('path', { d: obj.attributes.d, style: 'fill: var(--icon-color);' });
        });
    }
    private addSymbol(svgObj: any, viewBox: string): void{
        var filename = svgObj.id;
        this.sprite.ele('use', { 'xlink:href' : '#' + filename });
        var symbol = this.sprite.ele('symbol', { viewBox : viewBox, id : filename });
        symbol.ele('title', filename);
        var group = symbol.ele('g');
        svgObj.children.map((obj, index) => {
            group.ele('path', { d: obj.attributes.d, style: 'fill: var(--icon-color);' });
        });
    }
    public generate(type='stacked'): StandardiseSVG{
        let x = 0;
        let y = 0;
        let width = this.options.width + this.options.padding * 2;
        let height = this.options.height + this.options.padding * 2;
        if (type=='symbol'){
            let total = this.svgs.length;
            let maxWidth = Math.floor(Math.sqrt(total)) * width;
            let maxHeight = Math.ceil(Math.sqrt(total)) * height;
            let viewBox = 0 + ' ' + 0 + ' ' + maxWidth + ' ' + maxHeight;
            // this.sprite.att({ width: maxWidth, height: maxHeight, viewBox: viewBox, preserveAspectRatio: 'xMidYMid slice'});
            this.svgs.map((svg, index) => {
                let viewBox = -x + ' ' + -y + ' ' + maxWidth + ' ' + maxHeight;
                this.addSymbol(svg, viewBox);
                x += width;
                if (x > maxWidth) {
                    x = 0;
                    y += height;
                }
            });       
        } else {
            // stacked
            var defs = this.sprite.ele('defs');
            defs.ele('style', '\n svg .icon { display: none; } \n svg .icon:target { display: inline; } \n');
            this.sprite.att({ class: 'icon' });
            let viewBox = 0 + ' ' + 0 + ' ' + width + ' ' + height;
            this.svgs.map((svg) => { this.addSVG(svg, viewBox); });
        }
        return this;
    }
    public write(desfile){
        var xmldoc = this.sprite.toString({ pretty: true });
        fs.writeFile(desfile, xmldoc, (err) => {
            if (err) throw err;
            console.log('The file ' + desfile + ' has been created successfully!');
        });
    }
}

const svg = new StandardiseSVG('./src/light/');
svg.generate('stacked').write('./src/sprites.svg');