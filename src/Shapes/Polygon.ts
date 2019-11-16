import { Shape } from './shape';

export class Polygon implements Shape{
    name: string;
    points: any;
    p1: any;
    p2: any;
    constructor(){
        this.name = 'polygon';
    }
    public convertToPath(obj: any): any{
        return this;
    }
    public getBox(): any{
        let xArr = this.points.map(p => { return p.x; });
        let yArr = this.points.map(p => { return p.y; });
        this.p1 = { x: Math.min(xArr), y: Math.min(yArr) };
        this.p2 = { x: Math.max(xArr), y: Math.max(yArr) };
        return this;
    }
}