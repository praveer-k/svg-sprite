import { Shape } from './Shape';

export class Path implements Shape{
    name: string;
    constructor(){
        this.name = 'path';
    }
    public convertToPath(obj: any): any{
        let newObj = { name: obj.name,
                       attributes: {
                            d: obj.attributes.d,
                            style: obj.attributes.style===undefined? '':obj.attributes.style
                    }
        };
        return newObj;
    }
    private getViewBoxForPath(): void{

    }
    private scalePathToStandardViewBox(): void{

    }
}