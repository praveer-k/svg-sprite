const fs = require('fs');
const path = require('path');
const inspect = require('util').inspect;
const fastXmlParser = require('fast-xml-parser');
const builder = require('xmlbuilder');

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
            var coordinates = this.buildCoordinates(coords, p);
            switch(instruction){
                case 'M':
                case 'm':
                    if(index==0){
                        p = { x: coordinates[0].x, y: coordinates[0].y };
                    }
                case 'L':
                case 'H':
                case 'V':
                case 'l':
                case 'h':
                case 'v':
                    // no control points
                    coordinates.map((pair, index) => {
                        p = (pair.x==null && pair.y==null) ? p : p;
                        p = (pair.x==null && pair.y!=null) ? { x: p.x + pair.x, y: p.y } : p;
                        p = (pair.x!=null && pair.y==null) ? { x: p.x, y: p.y + pair.y } : p;
                        p = (pair.x!=null && pair.y!=null) ? { x: pair.x, y: pair.y } : p;
                        if(p.x > width){ width = p.x; }
                        if(p.y > height){ height = p.y; }
                    });
                break;
                case 'C':
                case 'Q':
                case 'S':
                case 'T':
                case 'c':
                case 'q':
                case 's':
                case 't':
                    // has control points
                    p = this.getMaxBoundInCubicBezierCurve(coordinates, p, instruction);
                break;
                case 'A':
                case 'a':
                    // no control points
                    p = this.getMaxBoundInArc(coords, p);
                break;
            }
            if(p.x > width){ width = p.x; }
            if(p.y > height){ height = p.y; }
        });
        return {width: width, height: height};
    }
    private getMaxBoundInCubicBezierCurve(coordinates, p, curveType){
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
        let la = parseFloat(coords.split(' ')[3].trim()); // large-arc-flag
        let s = parseFloat(coords.split(' ')[4].trim());  // sweep-flag
        let x2 = parseFloat(coords.split(' ')[5].trim());
        let y2 = parseFloat(coords.split(' ')[6].trim());
        let max = Math.abs(x1);
        if (Math.abs(y1) > max) { max = Math.abs(y1); }
        if(s==1){
            x2 += y1;
            y2 += x1;
        }
        x2 += max * Math.cos(theta);
        y2 += max * Math.sin(theta);
        p.x = Math.max(p.x, x2);
        p.y = Math.max(p.y, y2);
        return { x: p.x, y: p.y };
    }
    private buildCoordinates(coords: string, p: any): any{
        let coordinates = [];
        let point = { x: null, y: null };
        coords.split(' ').map((ele, index)=>{
            if(index%2==0){
                point.x = parseFloat(ele.trim());
                point.x = (point.x<0) ? (p.x + point.x) : point.x;
            }else{
                point.y = parseFloat(ele.trim());
                point.y = (point.y<0) ? (p.y + point.y) : point.y;
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
        var res = d.replace(/([A-Z])/g,"|$1");
        res = (res[0]=='|') ? res.substr(1):res;
        var steps = res.split('|');
        var newSteps = '';
        var p = { x: 0, y: 0 };
        steps.map((pointer, index)=>{
            pointer = pointer.trim();
            let instruction = pointer[0].toUpperCase();
            let coords = pointer.substr(1).replace(/-/g, ' -').replace(/,/g, ' ').trim();
            var coordinates = this.buildCoordinates(coords, p);
            if( instruction == 'M' && index==0 ){
                p = { x: coordinates[0].x, y: coordinates[0].y };
            }
            if(instruction=='M' || instruction=='L'){
                coordinates.map((coordinate)=>{
                    let x = coordinate.x * scale.x;
                    let y = coordinate.y * scale.y;
                    newSteps += instruction + ' ' + x.toFixed(4) + ',' + y.toFixed(4) + ' ';
                });
            }else if(instruction=='H'){
                let x = p.x * scale.x;
                newSteps += instruction + ' ' + x.toFixed(4) + ' ';
            }else if(instruction=='V'){
                let y = p.y * scale.y;
                newSteps += instruction + ' ' + y.toFixed(4) + ' ';
            }else if(instruction=='C' || instruction=='Q' || instruction=='S' || instruction=='T'){
                newSteps += instruction + ' ';
                coordinates.map((coordinate)=>{
                    let x = coordinate.x * scale.x;
                    let y = coordinate.y * scale.y;
                    newSteps += x.toFixed(4) + ',' + y.toFixed(4) + ' ';
                });
            }else if(instruction=='A'){
                let x1 = parseFloat(coords.split(' ')[0].trim()) * scale.x;
                let y1 = parseFloat(coords.split(' ')[1].trim()) * scale.y;
                let theta = parseFloat(coords.split(' ')[2].trim());
                let la = parseFloat(coords.split(' ')[3].trim()); // large-arc-flag
                let s = parseFloat(coords.split(' ')[4].trim());  // sweep-flag
                let x2 = parseFloat(coords.split(' ')[5].trim()) * scale.x;
                let y2 = parseFloat(coords.split(' ')[6].trim()) * scale.y;
                newSteps += instruction + ' ' + x1.toFixed(4) + ',' + y1.toFixed(4) + ' ' + theta + ' ' + la + ' ' + s + ' ' + x2.toFixed(4) + ',' + y2.toFixed(4) + ' ';
            }
            console.log(instruction, coords);
        });
        console.log("=----->" + newSteps);
        return newSteps;
    }
}