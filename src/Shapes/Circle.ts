import { Shape } from './Shape';

export class Circle implements Shape{
    name: string;
    constructor(){
        this.name = 'circle';
    }
    public convertToPath(obj: any): any{
        return obj;
    }
    public getBox(): any{
        let obj: any;
        return obj;
    }
}