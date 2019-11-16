import { Shape } from './shape';

export class Line implements Shape{
    name: string;
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    p1: any;
    p2: any;
    constructor(){
        this.name = 'line';
    }
    public convertToPath(obj: any): any{
        return this;
    }
    public getBox(): any{
        let x1 = Math.min(this.x1, this.x2);
        let y1 = Math.min(this.y1, this.y2);
        let x2 = Math.max(this.x1, this.x2);
        let y2 = Math.max(this.y1, this.y2);
        this.p1 = { x: x1, y: y1 };
        this.p2 = { x: x2, y: y2 };
        return this;
    }
}