const fs = require('fs');
const path = require('path');
const inspect = require('util').inspect;
const fastXmlParser = require('fast-xml-parser');
const builder = require('xmlbuilder');

import { Shapes } from './Shapes/Shapes';
import { Path } from './Shapes/Path';

export class SVGObject{
    private shapes: Shapes;
    private obj: any;
    private name: string;

    constructor(filepath){
        // viewbox
        this.shapes = new Shapes();
        this.readfile(filepath);
    }
    public getObject(){
        return this.obj;
    }
    public standardise(options:{ height: 64, width:64, padding:8 }): any{
        var drawTags = this.findShapeTags();
        // console.log(inspect(drawTags, { colors: true, depth: Infinity }));
        var paths = this.convertToPaths(drawTags);
        paths = this.scalePathsToViewBox(paths, options);
        this.obj = { name: 'svg',
                     attributes: { version: '1.1',
                                xmlns: 'http://www.w3.org/2000/svg',
                                'xmlns:xlink': 'http://www.w3.org/1999/xlink' },
                     id : this.name,
                     children: paths };
        return this;
    }
    // Private
    private readfile(filepath): any{
        this.name = filepath.substring(filepath.lastIndexOf('/')+1,  filepath.lastIndexOf('.'));
        let xml = fs.readFileSync(filepath, 'utf8');
        var options = {
            attributeNamePrefix : '',
            attrNodeName: 'attributes',
            ignoreAttributes : false,
            ignoreNameSpace : false,
            trimValues: true
        };
        this.obj = fastXmlParser.parse(xml, options);
        // console.log(inspect(this.obj, { colors: true, depth: Infinity }));
        if( Object.keys(this.obj)[0] !== 'svg' ){
            throw Error('Given xml object is not of SVG type...');
        }
    }
    private findShapeTags(children=this.obj, tags=[]): any{
        // when object is of type array then name = index
        Object.keys(children).map((name) => {
            if(typeof(children[name]) === 'object' && (name=='path' || name=='rectangle' || name=='circle' || name=='ellipse' || name=='line' || name=='polygon' || name=='polyline' || name=='text')){
                if(children[name] instanceof Array){
                    children[name].map((path)=>{
                        tags.push({ name: name, attributes: path.attributes });
                    });
                }else{
                    tags.push({ name: name, attributes: children[name].attributes });
                }
            }else if(typeof(children[name]) === 'object'){
                this.findShapeTags(children[name], tags);
            }
        });
        return tags;
    }
    private convertToPaths(tags: any): any{
        let paths = [];
        tags.map((obj, index) => {
            if(obj.name=='path' || obj.name=='circle'){
                let shape = this.shapes.getShape(obj.name);
                let newObj = shape.convertToPath(obj).getBox();
                paths.push(newObj);
            }
        });
        // console.log(inspect(paths, true, Infinity));
        return paths;
    }
    private scalePathsToViewBox(paths: any, options: any): any{
        let d = '';
        let p1 = {x:0, y:0};
        let p2 = {x:0, y:0};
        paths.map((path, index)=>{ 
            // console.log(inspect(path, true, Infinity));
            if(index == 0){
                p1 = JSON.parse(JSON.stringify(path.p1));
                p2 = JSON.parse(JSON.stringify(path.p2));
            }else{
                if(p1.x > path.p1.x){
                    p1.x = JSON.parse(JSON.stringify(path.p1.x));
                }
                if(p1.y > path.p1.y){
                    p1.y = JSON.parse(JSON.stringify(path.p1.y));
                }
                if(p2.x < path.p2.x){
                    p2.x = JSON.parse(JSON.stringify(path.p2.x));
                }
                if(p2.y < path.p2.y){
                    p2.y = JSON.parse(JSON.stringify(path.p2.y));
                }
            }
        });
        let bounds = { width: p2.x - p1.x, height: p2.y - p1.y };
        // to maintain aspect ratio choose the higher value between the two
        let size = Math.max(bounds.width, bounds.height);
        let boxSize = Math.max(options.width, options.height);
        let factor = boxSize/size;
        let xdiff = (size - bounds.width) * factor * 0.5;
        let ydiff = (size - bounds.height) * factor * 0.5;
        let xpad = options.padding + xdiff;
        let ypad = options.padding + ydiff;
        console.log(size.toPrecision(2), boxSize.toPrecision(2), factor.toPrecision(2), xpad.toPrecision(2), ypad.toPrecision(2));

        paths.map((path, index)=>{
            path.translate(-p1.x, -p1.y).scale(factor).translate(xpad, ypad).combineCommands();
        });
        // console.log(inspect(paths, true, Infinity));
        return paths;
    }
}