const fs = require('fs');
const parse = require('xml-parser');
const builder = require('xmlbuilder');
const path = require('path');
const inspect = require('util').inspect;

import { Shapes } from './Shapes/Shapes';

export class SVG{
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
    public standardise(options:{ height: 32, width:32, padding:8 }): any{
        var drawTags = this.findShapeTags();
        var paths = this.convertToPaths(drawTags);
        paths = this.scalePathsToViewBox(paths, options);
        this.obj = { name: 'svg',
                     attributes: { version: '1.1',
                                xmlns: 'http://www.w3.org/2000/svg',
                                'xmlns:xlink': 'http://www.w3.org/1999/xlink' },
                     id : this.name,
                     children: paths };
    }
    // Private
    private readfile(filepath): any{
        this.name = filepath.substring(filepath.lastIndexOf('/')+1,  filepath.lastIndexOf('.'));
        this.obj = parse(fs.readFileSync(filepath, 'utf8')).root;
        if( this.obj.name !== 'svg' ){
            throw Error('Given xml object is not of SVG type...');
        }
    }
    private findShapeTags(children=this.obj.children, tags=[]): any{
        if (children !== []){
            children.map((obj, index) => {
                if(obj.name=='path' || obj.name=='rectangle' || obj.name=='circle' || obj.name=='ellipse' || obj.name=='line' || 
                   obj.name=='polygon' || obj.name=='polyline' || obj.name=='text'){
                    tags.push(obj);
                }
                this.findShapeTags(obj.children, tags);
            });
        }
        return tags;
    }
    private convertToPaths(tags: any): any{
        let paths = [];
        tags.map((obj, index) => {
            let shape = this.shapes.getShape(obj.name);
            let newObj = shape.convertToPath(obj);
            paths.push(newObj);
        });
        return paths;
    }
    private scalePathsToViewBox(paths: any, options: any): any{
        let scaledPaths = [];
        paths.map((path, index)=>{
            scaledPaths.push(path);
        });
        return scaledPaths;
    }
}