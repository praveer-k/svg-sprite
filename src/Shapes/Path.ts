const inspect = require('util').inspect;
import { Shape } from './Shape';
import { cpus } from 'os';
// lines ...
class M{
    x: number;
    y: number;
    constructor(instruction, point, currentPosition){
        if(instruction=='m'){
            this.x = currentPosition.x + parseFloat(point[0]);
            this.y = currentPosition.y + parseFloat(point[1]);
        }else{
            this.x = parseFloat(point[0]);
            this.y = parseFloat(point[1]);
        }
        currentPosition.x = this.x;
        currentPosition.y = this.y;
    }
    public toString(){
        return this.x.toFixed(3) + ',' + this.y.toFixed(3);
    }
    public scale(factor): any{
        this.x = this.x * factor;
        this.y = this.y * factor;
    }
    public translate(x: number, y :number){
        this.x += x;
        this.y += y;
    }
}
class L{
    x: number;
    y: number;
    constructor(instruction, point, currentPosition){
        if(instruction=='l'){
            this.x = currentPosition.x + parseFloat(point[0]);
            this.y = currentPosition.y + parseFloat(point[1]);
        }else{
            this.x = parseFloat(point[0]);
            this.y = parseFloat(point[1]);
        }
        currentPosition.x = this.x;
        currentPosition.y = this.y;
    }
    public toString(){
        return this.x.toFixed(3) + ',' + this.y.toFixed(3);
    }
    public scale(factor): any{
        this.x = this.x * factor;
        this.y = this.y * factor;
    }
    public translate(x: number, y :number){
        this.x += x;
        this.y += y;
    }
}
class H{
    x: number;
    constructor(instruction, point, currentPosition){
        if(instruction=='h'){
            this.x = currentPosition.x + parseFloat(point[0]);
        }else{
            this.x = parseFloat(point[0]);
        }
        currentPosition.x = this.x;
    }
    public toString(){
        return this.x.toFixed(3);
    }
    public scale(factor): any{
        this.x = this.x * factor;
    }
    public translate(x: number, y=0){
        this.x += x;
    }
}
class V{
    y: number;
    constructor(instruction, point, currentPosition){
        if(instruction=='v'){
            this.y = currentPosition.y + parseFloat(point[0]);
        }else{
            this.y = parseFloat(point[0]);
        }
        currentPosition.y = this.y;
    }
    public toString(){
        return this.y.toFixed(3);
    }
    public scale(factor): any{
        this.y = this.y * factor;
    }
    public translate(x=0, y :number){
        this.y += y;
    }
}
class Z{
    ix: number;
    iy: number;
    constructor(){

    }
    public toString(){
        return '';
    }
    public scale(factor): any{
        // do nothing
    }
    public translate(x = 0, y = 0){
        // do nothing
    }
}
// curves ....
class C{
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    x: number;
    y: number;
    constructor(instruction, point, currentPosition){
        if(instruction=='c'){
            this.x1 = currentPosition.x + parseFloat(point[0]);
            this.y1 = currentPosition.y + parseFloat(point[1]);
            this.x2 = currentPosition.x + parseFloat(point[2]);
            this.y2 = currentPosition.y + parseFloat(point[3]);
            this.x = currentPosition.x + parseFloat(point[4]);
            this.y = currentPosition.y + parseFloat(point[5]);
        }else{
            this.x1 = parseFloat(point[0]);
            this.y1 = parseFloat(point[1]);
            this.x2 = parseFloat(point[2]);
            this.y2 = parseFloat(point[3]);
            this.x = parseFloat(point[4]);
            this.y = parseFloat(point[5]);
        }
        currentPosition.x = this.x;
        currentPosition.y = this.y;
    }
    public toString(){
        return this.x1.toFixed(3) + ',' + this.y1.toFixed(3) + ' ' + this.x2.toFixed(3) + ',' + this.y2.toFixed(3) + ' ' + this.x.toFixed(3) + ',' + this.y.toFixed(3);
    }
    public midpoint(x:number, y:number): any{
        let m1x = (x + this.x1)/2;
        let m1y = (y + this.y1)/2;
        let m2x = (this.x1 + this.x2)/2;
        let m2y = (this.y1 + this.y2)/2;
        let m3x = (this.x + this.x2)/2;
        let m3y = (this.y + this.y2)/2;
        
        let m12x = (m1x + m2x)/2;
        let m12y = (m1y + m2y)/2;
        let m23x = (m2x + m3x)/2;
        let m23y = (m2y + m3y)/2;

        let mx = (m12x + m23x)/2;
        let my = (m12y + m23y)/2;
        return { x: mx, y: my };
    }
    public scale(factor): any{
        this.x1 = this.x1 * factor;
        this.y1 = this.y1 * factor;
        this.x2 = this.x2 * factor;
        this.y2 = this.y2 * factor;
        this.x = this.x * factor;
        this.y = this.y * factor;
    }
    public translate(x: number, y :number){
        this.x1 += x; 
        this.y1 += y; 
        this.x2 += x;
        this.y2 += y;
        this.x += x;
        this.y += y;
    }
}
class S{
    x2: number;
    y2: number;
    x: number;
    y: number;
    constructor(instruction, point, currentPosition){
        if(instruction=='s'){
            this.x2 = currentPosition.x + parseFloat(point[0]);
            this.y2 = currentPosition.y + parseFloat(point[1]);
            this.x = currentPosition.x + parseFloat(point[2]);
            this.y = currentPosition.y + parseFloat(point[3]);
        }else{
            this.x2 = parseFloat(point[0]);
            this.y2 = parseFloat(point[1]);
            this.x = parseFloat(point[2]);
            this.y = parseFloat(point[3]);
        }
        currentPosition.x = this.x;
        currentPosition.y = this.y;
    }
    public toString(){
        return this.x2.toFixed(3) + ',' + this.y2.toFixed(3) + ' ' + this.x.toFixed(3) + ',' + this.y.toFixed(3);
    }
    public midpoint(cpx: number, cpy:number, x:number, y:number): any{
        let dx = Math.abs(Math.abs(x) - Math.abs(cpx));
        let dy = Math.abs(Math.abs(y) - Math.abs(cpy));
        let x1 = (cpx > x) ? x-dx : x+dx;
        let y1 = (cpy > y) ? y-dy : y+dy;
        // console.log('midpoint in S ', cpx, cpy, x, y, dx, dy, x1, y1);
        let m1x = (x + x1)/2;
        let m1y = (y + y1)/2;
        let m2x = (x1 + this.x2)/2;
        let m2y = (y1 + this.y2)/2;
        let m3x = (this.x + this.x2)/2;
        let m3y = (this.y + this.y2)/2;
        
        let m12x = (m1x + m2x)/2;
        let m12y = (m1y + m2y)/2;
        let m23x = (m2x + m3x)/2;
        let m23y = (m2y + m3y)/2;
        
        let mx = (m12x + m23x)/2;
        let my = (m12y + m23y)/2;
        return { x: mx, y: my };
    }
    public scale(factor): any{
        this.x2 = this.x2 * factor;
        this.y2 = this.y2 * factor;
        this.x = this.x * factor;
        this.y = this.y * factor;
    }
    public translate(x: number, y :number){
        this.x2 += x;
        this.y2 += y;
        this.x += x;
        this.y += y;
    }
}
class Q{
    x1: number;
    y1: number;
    x: number;
    y: number;
    constructor(instruction, point, currentPosition){
        if(instruction=='q'){
            this.x1 = currentPosition.x + parseFloat(point[0]);
            this.y1 = currentPosition.y + parseFloat(point[1]);
            this.x = currentPosition.x + parseFloat(point[2]);
            this.y = currentPosition.y + parseFloat(point[3]);
        }else{
            this.x1 = parseFloat(point[0]);
            this.y1 = parseFloat(point[1]);
            this.x = parseFloat(point[2]);
            this.y = parseFloat(point[3]);
        }
        currentPosition.x = this.x;
        currentPosition.y = this.y;
    }
    public toString(){
        return this.x1.toFixed(3) + ',' + this.y1.toFixed(3) + ' ' + this.x.toFixed(3) + ',' + this.y.toFixed(3);
    }
    public midpoint(x:number, y:number): any{
        let m1x = (x + this.x1)/2;
        let m1y = (y + this.y1)/2;
        let m2x = (this.x + this.x1)/2;
        let m2y = (this.y + this.y1)/2;
        let mx = (m1x + m2x)/2;
        let my = (m1y + m2y)/2;
        return { x: mx, y: my };
    }
    public scale(factor): any{
        this.x1 = this.x1 * factor;
        this.y1 = this.y1 * factor;
        this.x = this.x * factor;
        this.y = this.y * factor;
    }
    public translate(x: number, y :number){
        this.x1 += x; 
        this.y1 += y;
        this.x += x;
        this.y += y;
    }
}
class T{
    x: number;
    y: number;
    constructor(instruction, point, currentPosition){
        if(instruction=='t'){
            this.x = currentPosition.x + parseFloat(point[0]);
            this.y = currentPosition.y + parseFloat(point[1]);
        }else{
            this.x = parseFloat(point[0]);
            this.y = parseFloat(point[1]);
        }
        currentPosition.x = this.x;
        currentPosition.y = this.y;
    }
    public toString(){
        return this.x.toFixed(3) + ',' + this.y.toFixed(3);
    }
    public midpoint(cpx: number, cpy:number, x:number, y:number): any{
        let dx = Math.abs(Math.abs(x) - Math.abs(cpx));
        let dy = Math.abs(Math.abs(y) - Math.abs(cpy));
        let x1 = (cpx > x) ? x-dx : x+dx;
        let y1 = (cpy > y) ? y-dy : y+dy;
        let m1x = (x + x1)/2;
        let m1y = (y + y1)/2;
        let m2x = (this.x + x1)/2;
        let m2y = (this.y + y1)/2;
        let mx = (m1x + m2x)/2;
        let my = (m1y + m2y)/2;
        return { x: mx, y: my };
    }
    public scale(factor): any{
        this.x = this.x * factor;
        this.y = this.y * factor;
    }
    public translate(x: number, y :number){
        this.x += x;
        this.y += y;
    }
}
// circles and Arcs ....
class A{
    rx: number;
    ry: number;
    xar: number;
    laf: number;
    sf: number;
    x: number;
    y: number;
    constructor(instruction, point, currentPosition){
        this.rx = parseFloat(point[0]);
        this.ry = parseFloat(point[1]);
        this.xar = parseFloat(point[2]);
        this.laf = parseFloat(point[3]);
        this.sf = parseFloat(point[4]);
        if(instruction=='a'){
            this.x = currentPosition.x + parseFloat(point[5]);
            this.y = currentPosition.y + parseFloat(point[6]);
        }else{
            this.x = parseFloat(point[5]);
            this.y = parseFloat(point[6]);
        }
        currentPosition.x = this.x;
        currentPosition.y = this.y;
    }
    public toString(){
        return this.rx.toFixed(3)+ ',' + this.ry.toFixed(3) + ' ' + this.xar + ' ' + this.laf + ' ' + this.sf + ' ' + this.x.toFixed(3) + ',' + this.y.toFixed(3);
    }
    public scale(factor): any{
        this.rx = this.rx * factor;
        this.ry = this.ry * factor;
        // this.xar = this.xar * factor;
        this.x = this.x * factor;
        this.y = this.y * factor;
    }
    public translate(x: number, y :number){
        this.rx += x; 
        this.ry += y; 
        this.x += x;
        this.y += y;
    }
}
class Element{
    public getElement(instruction, point, currentPosition): any{
        var obj: any;
        switch(instruction.toUpperCase()){
            case 'M':
                obj = new M(instruction, point, currentPosition);
            break;
            case 'L':
                obj = new L(instruction, point, currentPosition);
            break;
            case 'H':
                obj = new H(instruction, point, currentPosition);
            break;
            case 'V':
                obj = new V(instruction, point, currentPosition);
            break;
            case 'Z':
                obj = new Z();
            break;
            case 'C':
                obj = new C(instruction, point, currentPosition);
            break;
            case 'S':
                obj = new S(instruction, point, currentPosition);
            break;
            case 'Q':
                obj = new Q(instruction, point, currentPosition);
            break;
            case 'T':
                obj = new T(instruction, point, currentPosition);
            break;
            case 'A':
                obj = new A(instruction, point, currentPosition);
            break;
        }
        return obj;
    }
    public getChunkSize(instruction): any{
        let chunkSize = 0;
        switch(instruction.toUpperCase()){
            case 'H': 
            case 'V':
                chunkSize = 1;
            break;
            case 'M':
            case 'L':
            case 'T':
                chunkSize = 2;
            break;
            case 'Q':
            case 'S':
                chunkSize = 4;
            break;
            case 'C':
                chunkSize = 6;
            break;
            case 'A':
                chunkSize = 7;
            break;
            case 'Z':
                chunkSize = 0;
            break;
        }
        return chunkSize;
    }
}
// end
export class Path implements Shape{
    name: string;
    d: string;
    objArr: any;
    p1: any;
    p2: any;
    attributes: any;
    constructor(){
        this.name = 'path';
        this.attributes = {};
        this.attributes.d = '';
        this.attributes.style = '';
        this.objArr = [];
    }
    public convertToPath(obj: any): any{
        this.relativePathToAbsolute(obj).combineElements();
        this.attributes.style = (obj.attributes.style===undefined) ? '' : obj.attributes.style;
        return this;
    }
    public getBox(){
        this.p1 = { x: this.objArr[0].x, y: this.objArr[0].y };
        this.p2 = { x: this.objArr[0].x, y: this.objArr[0].y };
        let cur = { x: this.objArr[0].x, y: this.objArr[0].y };
        var dirx = NaN;
        var diry = NaN;
        this.objArr.map((obj, index)=>{
            switch(obj.constructor.name){
                case 'M':
                case 'L':
                    if( this.p1.x > obj.x ){ this.p1.x = obj.x; }
                    if( this.p1.y > obj.y ){ this.p1.y = obj.y; }
                    if( this.p2.x < obj.x ){ this.p2.x = obj.x; }
                    if( this.p2.y < obj.y ){ this.p2.y = obj.y; }
                    cur.x = obj.x;
                    cur.y = obj.y;
                break;
                case 'H':
                    cur.x = obj.x;
                    if( this.p1.x > obj.x ){ this.p1.x = obj.x; }
                    if( this.p2.x < obj.x ){ this.p2.x = obj.x; }
                break;
                case 'V':
                    cur.y = obj.y;
                    if( this.p1.y > obj.y ){ this.p1.y = obj.y; }
                    if( this.p2.y < obj.y ){ this.p2.y = obj.y; }
                break;
                case 'C':
                    if( this.p1.x > Math.min(cur.x, obj.x, obj.midpoint(cur.x, cur.y).x ) ){ this.p1.x = Math.min(cur.x, obj.x, obj.midpoint(cur.x, cur.y).x); }
                    if( this.p1.y > Math.min(cur.y, obj.y, obj.midpoint(cur.x, cur.y).y ) ){ this.p1.y = Math.min(cur.y, obj.y, obj.midpoint(cur.x, cur.y).y); }
                    if( this.p2.x < Math.max(cur.x, obj.x, obj.midpoint(cur.x, cur.y).x ) ){ this.p2.x = Math.max(cur.x, obj.x, obj.midpoint(cur.x, cur.y).x); }
                    if( this.p2.y < Math.max(cur.y, obj.y, obj.midpoint(cur.x, cur.y).y ) ){ this.p2.y = Math.max(cur.y, obj.y, obj.midpoint(cur.x, cur.y).y); }
                    cur.x = obj.x;
                    cur.y = obj.y;
                    dirx = obj.x2;
                    diry = obj.y2;
                break;
                case 'S':
                    let sx = obj.midpoint(cur.x, cur.y, dirx, diry).x;
                    let sy = obj.midpoint(cur.x, cur.y, dirx, diry).y;
                    if( this.p1.x > Math.min(cur.x, obj.x, sx ) ){ this.p1.x = Math.min(cur.x, obj.x, sx); }
                    if( this.p1.y > Math.min(cur.y, obj.y, sy ) ){ this.p1.y = Math.min(cur.y, obj.y, sy); }
                    if( this.p2.x < Math.max(cur.x, obj.x, sx ) ){ this.p2.x = Math.max(cur.x, obj.x, sx); }
                    if( this.p2.y < Math.max(cur.y, obj.y, sy ) ){ this.p2.y = Math.max(cur.y, obj.y, sy); }
                    cur.x = obj.x;
                    cur.y = obj.y;
                    dirx = obj.x2;
                    diry = obj.y2;
                    break;
                case 'Q':
                    dirx = obj.x1;
                    diry = obj.y1;
                    break;
                case 'T':
                    break;
                case 'A':
                    if(obj.laf == 0 && obj.sf == 0){
                        let x1 = (obj.x - obj.rx);
                        let y1 = (obj.y - obj.ry);
                        let x2 = obj.x;
                        let y2 = obj.y;
                    } else if(obj.laf == 0 && obj.sf == 1){
                        let x1 = (obj.x - obj.rx);
                        let y1 = (obj.y - obj.ry);
                        let x2 = obj.x;
                        let y2 = obj.y;
                    } else if(obj.laf == 1 && obj.sf == 0){
                        let x1 = (obj.x - 2 * obj.rx);
                        let y1 = (obj.y - obj.ry);
                        let x2 = obj.x;
                        let y2 = obj.y + obj.ry;
                    } else {
                        let x1 = (obj.x - obj.rx);
                        let y1 = (obj.y - 2 * obj.ry);
                        let x2 = obj.x + obj.rx;
                        let y2 = obj.y;
                    }
                    cur.x = obj.x;
                    cur.y = obj.y;
                break;
            }
            // console.log(obj.constructor.name, inspect([this.p1,this.p2],true, Infinity));
        });
        this.p1.x = this.p1.x;
        this.p1.y = this.p1.y;
        this.p2.x = this.p2.x;
        this.p2.y = this.p2.y;
        // console.log(inspect([this.p1,this.p2],true, Infinity));
        return this;
    }
    private relativePathToAbsolute(obj: any): any{
        let res = obj.attributes.d.replace(/([a-zA-Z])/g,"|$1");
        // console.log(res);
        res = (res[0]=='|') ? res.substr(1):res;
        var steps = [];
        var ele = new Element();
        let currentPosition = { x: 0, y:0 };
        res.split('|').map((pointer, index)=>{
            let instruction = pointer[0].trim();
            let coords = pointer.substr(1).replace(/-/g, ' -').replace(/,/g, ' ').trim().split(' ');
            let chunkSize = (ele.getChunkSize(instruction)==0) ? 1:ele.getChunkSize(instruction);
            // console.log(instruction, coords, chunkSize, coords.length);
            for (let i=0, j=coords.length; i<j; i+=chunkSize) {
                let temp = coords.slice(i, i+chunkSize);
                // console.log(temp);
                if(temp.length == chunkSize){
                    steps.push(ele.getElement(instruction, temp, currentPosition));
                }
            }
        });
        // console.log(inspect(steps, { color: true, depth: Infinity }));
        this.objArr = steps;
        return this;
    }
    public combineElements(): any{
        let path = '';
        this.objArr.map((obj, i)=>{
            // console.log(obj.constructor.name);
            path += obj.constructor.name + ' ' + obj.toString() + ' ';
        });
        // console.log(path);
        this.attributes.d = path.trim();
        return this;
    }
    public scale(factor): any{
        this.objArr.map((obj, index)=>{
            // console.log(inspect(obj, true, Infinity));
            obj.scale(factor);
        });
        return this;
    }
    public translate(x: number, y:number): any{
        this.objArr.map((obj, index)=>{
            // console.log(inspect(obj, true, Infinity));
            obj.translate(x, y);
        });
        return this;
    }
}