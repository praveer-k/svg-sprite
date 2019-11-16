import { Shape } from './shape';

export class Rectangle implements Shape{
    name: string;
    x: number;
    y: number;
    width: number;
    height: number;
    rx: number;
    ry: number;
    p1: any;
    p2: any;
    constructor(){
        this.name = 'rectangle';
    }
    public convertToPath(obj: any): any{
        return this;
    }
    public getBox(): any{
        this.p1 = { x: this.x, y: this.y };
        this.p2 = { x: this.x + this.width, y: this.y + this.height };
        return this;
    }
}