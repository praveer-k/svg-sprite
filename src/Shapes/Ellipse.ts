import { Shape } from './Shape';

export class Ellipse implements Shape{
    name: string;
    constructor(){
        this.name = 'ellipse';
    }
    public convertToPath(obj: any): any{
        return this;
    }
    public getBox(): any{
        return this;
    }
}