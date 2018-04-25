export class A{
    rx: number;
    ry: number;
    xar: number;
    laf: number;
    sf: number;
    x: number;
    y: number;
    constructor(instruction:string, point, currentPosition={x:0, y:0}){
        this.rx = parseFloat(point[0]);
        this.ry = parseFloat(point[1]);
        this.xar = parseFloat(point[2]);
        this.laf = parseFloat(point[3]);
        this.sf = parseFloat(point[4]);
        if(instruction=='a'){
            this.x = currentPosition.x + parseFloat(point[5]);
            this.y = currentPosition.y + parseFloat(point[6]);
        }else{
            this.x = parseFloat(point[5]);
            this.y = parseFloat(point[6]);
        }
        currentPosition.x = this.x;
        currentPosition.y = this.y;
    }
    public toString(){
        return this.rx.toFixed(3)+ ',' + this.ry.toFixed(3) + ' ' + this.xar + ' ' + this.laf + ' ' + this.sf + ' ' + this.x.toFixed(3) + ',' + this.y.toFixed(3);
    }
    public scale(factor): any{
        this.rx = this.rx * factor;
        this.ry = this.ry * factor;
        // this.xar = this.xar * factor;
        this.x = this.x * factor;
        this.y = this.y * factor;
    }
    public translate(x: number, y :number){
        this.rx += x; 
        this.ry += y; 
        this.x += x;
        this.y += y;
    }
}