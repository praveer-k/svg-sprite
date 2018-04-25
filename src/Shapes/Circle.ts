import { Shape } from './Shape';

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
        return this;
    }
    public getBox(): any{
        return this;
    }
}