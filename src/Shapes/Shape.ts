export interface Shape{
    name: string;
    convertToPath(obj: any): any;
    getBox(): any;
}