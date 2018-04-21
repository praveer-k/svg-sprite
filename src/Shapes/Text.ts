import { Shape } from './Shape';

export class Text implements Shape{
    name: string;
    constructor(){
        this.name = 'text';
    }
    public convertToPath(obj: any): any{
        return obj;
    }
    public getBox(): any{
        let obj: any;
        return obj;
    }
}