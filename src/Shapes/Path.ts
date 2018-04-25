const inspect = require('util').inspect;
import { Shape } from './Shape';
import { A, C, H, L, M, Q, S, T, V, Z } from './instructions';

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
                    if( this.p1.x > Math.min(cur.x, obj.x, obj.midpoint(cur.x, cur.y).x ) ){ this.p1.x = Math.min(cur.x, obj.x, obj.midpoint(cur.x, cur.y).x); }
                    if( this.p1.y > Math.min(cur.y, obj.y, obj.midpoint(cur.x, cur.y).y ) ){ this.p1.y = Math.min(cur.y, obj.y, obj.midpoint(cur.x, cur.y).y); }
                    if( this.p2.x < Math.max(cur.x, obj.x, obj.midpoint(cur.x, cur.y).x ) ){ this.p2.x = Math.max(cur.x, obj.x, obj.midpoint(cur.x, cur.y).x); }
                    if( this.p2.y < Math.max(cur.y, obj.y, obj.midpoint(cur.x, cur.y).y ) ){ this.p2.y = Math.max(cur.y, obj.y, obj.midpoint(cur.x, cur.y).y); }
                    cur.x = obj.x;
                    cur.y = obj.y;
                    dirx = obj.x1;
                    diry = obj.y1;
                    break;
                case 'T':
                    let tx = obj.midpoint(cur.x, cur.y, dirx, diry).x;
                    let ty = obj.midpoint(cur.x, cur.y, dirx, diry).y;
                    if( this.p1.x > Math.min(cur.x, obj.x, tx ) ){ this.p1.x = Math.min(cur.x, obj.x, tx); }
                    if( this.p1.y > Math.min(cur.y, obj.y, ty ) ){ this.p1.y = Math.min(cur.y, obj.y, ty); }
                    if( this.p2.x < Math.max(cur.x, obj.x, tx ) ){ this.p2.x = Math.max(cur.x, obj.x, tx); }
                    if( this.p2.y < Math.max(cur.y, obj.y, ty ) ){ this.p2.y = Math.max(cur.y, obj.y, ty); }
                    cur.x = obj.x;
                    cur.y = obj.y;
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