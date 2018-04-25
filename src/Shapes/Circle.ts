import { Shape } from './Shape';
import { M, A } from './commands';
import { Path } from './Path';

export class Circle implements Shape{
    name: string;
    cx: number;
    cy: number;
    r: number;
    constructor(){
        //<circle cx="50" cy="50" r="40" stroke="black" stroke-width="3" fill="red" />
        this.name = 'circle';
    }
    public convertToPath(obj: any): any{
        this.cx = parseFloat(obj.attributes.cx);
        this.cy = parseFloat(obj.attributes.cy);
        this.r = parseFloat(obj.attributes.r);
        let m = new M('M', [this.cx - this.r, this.cy]);
        let a1 = new A('A', [this.r, this.r, 0, 0, 0, this.cx + this.r, this.cy]);
        let a2 = new A('A', [this.r, this.r, 0, 0, 0, this.cx - this.r, this.cy]);
        let d = [
            'M ' + m.toString(),
            'A ' + a1.toString(),
            'A ' + a2.toString(),
            'Z'
        ].join(' ');
        let newObj = { 'name' : 'path',
                        'attributes': {
                            'd' : d
                        }
                     };
        console.log(newObj);
        let p = new Path().convertToPath(newObj);
        return p;
    }
    public getBox(): any{
        return this;
    }
}