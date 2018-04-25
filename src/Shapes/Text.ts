import { Shape } from './Shape';

export class Text implements Shape{
    name: string;
    x: number;
    y: number;
    text: string;
    constructor(){
        this.name = 'text';
    }
    public convertToPath(obj: any): any{
        return this;
    }
    public getBox(): any{
        return this;
    }
}