const fs = require('fs');
const builder = require('xmlbuilder');
const path = require('path');

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
                    let name = fullPath.substring(fullPath.lastIndexOf('/')+1,  fullPath.lastIndexOf('.'));
                    // if(name=='cloud-upload'){
                        console.log(fullPath);
                        objRef.svgs.push( new SVG(fullPath).standardise(objRef.options).getObject() );
                    // }
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
            group.ele('path', { d: obj.attributes.d, style: obj.attributes.style });
        });
        // group.ele('path',{ d: 'M0,0 L 48,0 48,48 0,48 Z M 0,24 L 24,24', style:'stroke: #ff0000; stroke-width:1; fill:none;' });
    }
    private addSymbol(svgObj: any, viewBox: string): void{
        var filename = svgObj.id;
        this.sprite.ele('use', { 'xlink:href' : '#' + filename });
        var symbol = this.sprite.ele('symbol', { viewBox : viewBox, id : filename });
        symbol.ele('title', filename);
        var group = symbol.ele('g');
        svgObj.children.map((obj, index) => {
            group.ele('path', { d: obj.attributes.d, style: obj.attributes.style });
        });
        // group.ele('path',{ d: 'M0,0 L 48,0 48,48 0,48 Z M 0,24 L 24,24', style:'stroke: #ff0000; stroke-width:1; fill:none;' });
    }
    private addViewTranslate(svgObj: any, xy: string, wh: string): void{
        var filename = svgObj.id;
        let viewBox = xy + ' ' + wh;
        this.sprite.ele('view', { id : filename, viewBox : viewBox });
        var group = this.sprite.ele('g', { transform: 'translate('+ xy +')'});
        svgObj.children.map((obj, index) => {
            group.ele('path', { d: obj.attributes.d, style: obj.attributes.style });
        });
        // group.ele('path',{ d: 'M0,0 L 48,0 48,48 0,48 Z M 0,24 L 24,24', style:'stroke: #ff0000; stroke-width:1; fill:none;' });
    }
    public generate(type='stacked'): StandardiseSVG{
        let x = 0;
        let y = 0;
        let width = this.options.width + this.options.padding * 2;
        let height = this.options.height + this.options.padding * 2;
        let total = this.svgs.length;
        let maxWidth = (Math.sqrt(total) % 1 !== 0) ? (parseInt(Math.sqrt(total).toFixed(0))) * width : Math.sqrt(total) * width;
        let maxHeight = (Math.sqrt(total) % 1 !== 0) ? (parseInt(Math.sqrt(total).toFixed(0))+1) * height : Math.sqrt(total) * height;
        let viewBox = '';
        switch(type){
            case 'symbol':
                viewBox = 0 + ' ' + 0 + ' ' + maxWidth + ' ' + maxHeight;
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
            break;
            case 'viewtranslate':
                viewBox = 0 + ' ' + 0 + ' ' + maxWidth + ' ' + maxHeight;
                this.sprite.att({ width: maxWidth, height: maxHeight, viewBox: viewBox, preserveAspectRatio: 'xMidYMid slice'});
                this.svgs.map((svg, index) => {
                    let xy = x + ' ' + y;
                    let wh = width + ' ' + height;
                    this.addViewTranslate(svg, xy, wh);
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
                this.svgs.map((svg) => { this.addSVG(svg, viewBox); });
            break;
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

const svg = new StandardiseSVG('./src/icomoon/svg');
svg.generate('viewtranslate').write('./src/sprites.svg');