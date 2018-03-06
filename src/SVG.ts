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
        var steps = res.split(' |');
        var width = 0;
        var height = 0;
        var x = 0;
        var y = 0;
        var p;
        steps.map((pointer, index)=>{
            pointer = pointer.trim();
            let instruction = pointer[0];
            let coords = pointer.substr(1)
            coords = coords.replace(/,/g, ' ');
            //console.log(instruction, coords);
            switch(instruction){
                case 'M':
                case 'L':
                    x = Math.max(x, parseFloat(coords.split(' ')[0].trim()));
                    y = Math.max(y, parseFloat(coords.split(' ')[1].trim()));
                break;
                case 'H':
                    x = Math.max(x, x + parseFloat(coords.trim()));
                break;
                case 'V':
                    y = Math.max(y, y + parseFloat(coords.trim()));
                break;
                case 'C':
                    p = this.getMaxBoundInCubicBezierCurve(coords, x, y);
                    x = p.x;
                    y = p.y;
                break;
                case 'S':
                    p = this.getMaxBoundInS(coords, x, y, p);
                    x = p.x;
                    y = p.y;
                break;
                case 'Q':
                    p = this.getMaxBoundInQ(coords, x, y);
                    x = p.x;
                    y = p.y;
                break;
                case 'T':
                    p = this.getMaxBoundInT(coords, x, y, p);
                    x = p.x;
                    y = p.y;
                break;
                case 'A':
                    p = this.getMaxBoundInA(coords, x, y);
                    x = p.x;
                    y = p.y;
                break;
            }
            if(x > width){ width = x; }
            if(y > height){ height = y; }
        });
        return {width: width, height: height};
    }
    private getMaxBoundInCubicBezierCurve(coords, x, y){
        let x1 = x;
        let y1 = y;
        let x2 = parseFloat(coords.split(' ')[0].trim());
        let y2 = parseFloat(coords.split(' ')[1].trim());
        let x3 = parseFloat(coords.split(' ')[2].trim());
        let y3 = parseFloat(coords.split(' ')[3].trim());
        let x4 = parseFloat(coords.split(' ')[4].trim());
        let y4 = parseFloat(coords.split(' ')[5].trim());
        let m1 = [(x1+x2)/2, (y1+y2)/2];
        let m2 = [(x2+x3)/2, (y2+y3)/2];
        let m3 = [(x3+x4)/2, (y3+y4)/2];
        let m12 = [(m1[0] + m2[0])/2, (m1[1] + m2[1])/2];
        let m23 = [(m2[0] + m3[0])/2, (m2[1] + m3[1])/2];
        let mx = (m12[0] + m23[0])/2;
        let my = (m12[1] + m23[1])/2;
        x = Math.max(x1, mx, x4);
        y = Math.max(y1, my, y4);
        return { x: x, y: y, cpx1: x3, cpy1: y3, cpx2: x4, cpy2: y4 };
    }
    private getMaxBoundInS(coords, x, y, p){
        let x1 = x;
        let y1 = y;
        let x3 = parseFloat(coords.split(' ')[0].trim());
        let y3 = parseFloat(coords.split(' ')[1].trim());

        let x2 = p.cpx2 + (p.cpx2 - p.cpx1);
        let y2 = p.cpy2 + (p.cpy2 - p.cpy1);
        x2 = (x2!==undefined) ? x3:x2;
        y2 = (y2!==undefined) ? y3:y2;
        
        let x4 = parseFloat(coords.split(' ')[2].trim());
        let y4 = parseFloat(coords.split(' ')[3].trim());
        let m1 = [(x1+x2)/2, (y1+y2)/2];
        let m2 = [(x2+x3)/2, (y2+y3)/2];
        let m3 = [(x3+x4)/2, (y3+y4)/2];
        let m12 = [(m1[0] + m2[0])/2, (m1[1] + m2[1])/2];
        let m23 = [(m2[0] + m3[0])/2, (m2[1] + m3[1])/2];
        let mx = (m12[0] + m23[0])/2;
        let my = (m12[1] + m23[1])/2;
        x = Math.max(x1, mx, x4);
        y = Math.max(y1, my, y4);
        return { x: x, y: y, cpx1: x3, cpy1: y3, cpx2: x4, cpy2: y4 };
    }
    private getMaxBoundInQ(coords, x, y){
        let x1 = x;
        let y1 = y;
        let x2 = parseFloat(coords.split(' ')[0].trim());
        let y2 = parseFloat(coords.split(' ')[1].trim());
        let x3 = parseFloat(coords.split(' ')[2].trim());
        let y3 = parseFloat(coords.split(' ')[3].trim());
        let m1 = [(x1+x2)/2, (y1+y2)/2];
        let m2 = [(x2+x3)/2, (y2+y3)/2];
        let mx = (m1[0] + m2[0])/2;
        let my = (m1[1] + m2[1])/2;
        x = Math.max(x1, mx, x3);
        y = Math.max(y1, my, y3);
        return { x: x, y: y, cpx1: x2, cpy1: y2, cpx2: x3, cpy2: y3 };
    }
    private getMaxBoundInT(coords, x, y, p){
        let x1 = x;
        let y1 = y;
        let x2 = p.cpx2 + (p.cpx2 - p.cpx1);
        let y2 = p.cpy2 + (p.cpy2 - p.cpy1);
        let x3 = parseFloat(coords.split(' ')[0].trim());
        let y3 = parseFloat(coords.split(' ')[1].trim());
        if( x2!==undefined && y2!==undefined){
            let m1 = [(x1+x2)/2, (y1+y2)/2];
            let m2 = [(x2+x3)/2, (y2+y3)/2];
            let mx = (m1[0] + m2[0])/2;
            let my = (m1[1] + m2[1])/2;
            x = Math.max(x1, mx, x3);
            y = Math.max(y1, my, y3);
        }
        return { x: x, y: y, cpx1: x2, cpy1: y2, cpx2: x3, cpy2: y3 };
    }
    private getMaxBoundInA(coords, x, y){
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
        x = Math.max(x, x2);
        y = Math.max(y, y2);
        return { x: x, y: y };
    }
    private scale(d: string, scale={x: 1, y: 1}){
        d = d.toUpperCase();
        var res = d.replace(/([A-Z])/g,"|$1");
        res = (res[0]=='|') ? res.substr(1):res;
        var steps = res.split(' |');
        var newSteps = '';
        steps.map((pointer, index)=>{
            pointer = pointer.trim();
            let instruction = pointer[0];
            let coords = pointer.substr(1).replace(/,/g, ' ');
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
            newSteps += instruction + ' ' + newCooords;
        });
        //console.log("=----->" + newSteps);
        return newSteps;
    }
}