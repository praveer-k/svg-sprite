import { Shape } from './Shape';

export class Ellipse implements Shape{
    name: string;
    cx: number;
    cy: number;
    rx: number;
    ry: number;
    p1: any;
    p2: any;
    constructor(){
        this.name = 'ellipse';
    }
    public convertToPath(obj: any): any{
        return this;
    }
    public getBox(): any{
        this.p1 = { x: this.cx - this.rx, y: this.cy - this.ry };
        this.p2 = { x: this.cx + this.rx, y: this.cy + this.ry };
        return this;
    }
}