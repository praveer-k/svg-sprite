const fs = require('fs');
const parse = require('xml-parser');
const builder = require('xmlbuilder');
const path = require('path');
const inspect = require('util').inspect;

import { Shapes } from './Shapes/Shapes';
import { Path } from './Shapes/Path';

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
        let d = '';
        paths.map((path)=>{ d += path.attributes.d + ' '; });
        let bounds = this.findBoundingRectangle(d);
        //console.log(bounds);
        let scale = { x: options.width/bounds.width, y: options.height/bounds.height };
        paths.map((path, index)=>{
            path.attributes.d = this.scale(path.attributes.d, scale);
            scaledPaths.push(path);
        });
        return scaledPaths;
    }
    private findBoundingRectangle(d: string){
        // line commands 
        // M, L, H, V, Z
        // Bezier curves
        // C, S, Q, T
        // Arcs and Circles
        // A
        d = d.toUpperCase();
        var res = d.replace(/([A-Z])/g,"|$1");
        res = (res[0]=='|') ? res.substr(1):res;
        var steps = res.split('|');
        var width = 0;
        var height = 0;
        var p = { x: 0, y: 0 };
        steps.map((pointer, index)=>{
            pointer = pointer.trim();
            let instruction = pointer[0];
            let coords = pointer.substr(1)
            coords = coords.replace(/-/g, ' -').replace(/,/g, ' ').trim();
            //console.log(instruction, coords);
            switch(instruction){
                case 'M':
                case 'L':
                    // no control points
                    p = { x: parseFloat(coords.split(' ')[0].trim()), y: parseFloat(coords.split(' ')[1].trim()) };
                break;
                case 'H':
                    // no control points
                    p = { x: p.x + parseFloat(coords.trim()), y: p.y };
                break;
                case 'V':
                    // no control points
                    p = { x: p.x, y: p.y + parseFloat(coords.trim()) };
                break;
                case 'C':
                case 'Q':
                case 'S':
                case 'T':
                    // has control points
                    p = this.getMaxBoundInCubicBezierCurve(coords, p, instruction);
                break;
                case 'A':
                    // no control points
                    p = this.getMaxBoundInArc(coords, p);
                break;
            }
            if(p.x > width){ width = p.x; }
            if(p.y > height){ height = p.y; }
        });
        return {width: width, height: height};
    }
    private getMaxBoundInCubicBezierCurve(coords, p, curveType){
        let coordinates = this.buildCoordinates(coords);
        coordinates.splice(0, 0, { x: p.x, y: p.y });
        if(curveType=='S' || curveType=='T'){
            let x2 = p.cpx2 + (p.cpx2 - p.cpx1);
            let y2 = p.cpy2 + (p.cpy2 - p.cpy1);
            if(x2!==undefined && y2!==undefined){
                coordinates.splice( 1, 0, { x: x2, y: y2 } );
            }
        }
        if(coordinates.length>2){
            let m = this.midpoint(JSON.parse(JSON.stringify(coordinates)));
            p.x = Math.max(coordinates[0].x, m.x, coordinates[coordinates.length-1].x);
            p.y = Math.max(coordinates[0].y, m.y, coordinates[coordinates.length-1].y);
        }
        return { x: p.x, y: p.y, cpx1: coordinates[coordinates.length-2].x, cpy1: coordinates[coordinates.length-2].y,
                             cpx2: coordinates[coordinates.length-1].x, cpy2: coordinates[coordinates.length-1].y };
    }
    private getMaxBoundInArc(coords, p){
        let x1 = parseFloat(coords.split(' ')[0].trim());
        let y1 = parseFloat(coords.split(' ')[1].trim());
        let theta = parseFloat(coords.split(' ')[2].trim());
        // let la = parseFloat(coords.split(' ')[3].trim()); // large-arc-flag
        // let s = parseFloat(coords.split(' ')[4].trim());  // sweep-flag
        let x2 = parseFloat(coords.split(' ')[5].trim());
        let y2 = parseFloat(coords.split(' ')[6].trim());
        let max = x1;
        if (y1 > max) { max = y1; }
        let radius = max * Math.cos(theta);
        x2 += radius;
        y2 += radius;
        p.x = Math.max(p.x, x2);
        p.y = Math.max(p.y, y2);
        return { x: p.x, y: p.y };
    }
    private buildCoordinates(coords: string): any{
        let coordinates = [];
        let point = { x: null, y: null };
        coords.split(' ').map((ele, index)=>{
            if(index%2==0){
                point.x = parseFloat(ele.trim());
            }else{
                point.y = parseFloat(ele.trim());
                coordinates.push(point);
                point = { x: null, y: null };
            }
        });
        return coordinates;
    }
    private midpoint(coordinates: any): any{
        var m = [];
        while(coordinates.length >= 2){
            let point = coordinates.pop(0);
            let x1 = point.x;
            let y1 = point.y;
            let x2 = coordinates[0].x;
            let y2 = coordinates[0].y;
            let mx = x1 + Math.abs((Math.abs(x1) - Math.abs(x2))/2);
            let my = y1 + Math.abs((Math.abs(y1) - Math.abs(y2))/2);
            m.push({ x: mx, y: my });
        }
        if(m.length>1){
            return this.midpoint(m);
        }else if(coordinates.length==1){
            return coordinates[0];
        }else{
            throw Error ('...Empty array of coordinates should be greater than 0');
        }
    }
    private scale(d: string, scale={x: 1, y: 1}){
        d = d.toUpperCase();
        var res = d.replace(/([A-Z])/g,"|$1");
        res = (res[0]=='|') ? res.substr(1):res;
        var steps = res.split('|');
        var newSteps = '';
        steps.map((pointer, index)=>{
            pointer = pointer.trim();
            let instruction = pointer[0];
            let coords = pointer.substr(1).replace(/-/g, ' -').replace(/,/g, ' ').trim();
            // console.log(instruction, coords);
            let newCooords = '';
            if(coords.length>0){
                coords.split(' ').map((num, index) => {
                    let n = parseFloat(num.trim());
                    if(index%2==0){
                        n = n * scale.x;
                        newCooords += n.toFixed(4) + ',';
                    }else{
                        n = n * scale.y;
                        newCooords += n.toFixed(4) + ' ';
                    }
                });
            }
            newCooords = (newCooords[newCooords.length-1]==',') ? newCooords.substring(0,newCooords.length-1): newCooords;
            newSteps += instruction + ' ' + newCooords;
        });
        // console.log("=----->" + newSteps);
        return newSteps;
    }
}