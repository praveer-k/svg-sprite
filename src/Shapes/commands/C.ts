export class C{
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    x: number;
    y: number;
    constructor(instruction, point, currentPosition={x:0, y:0}){
        if(instruction=='c'){
            this.x1 = currentPosition.x + parseFloat(point[0]);
            this.y1 = currentPosition.y + parseFloat(point[1]);
            this.x2 = currentPosition.x + parseFloat(point[2]);
            this.y2 = currentPosition.y + parseFloat(point[3]);
            this.x = currentPosition.x + parseFloat(point[4]);
            this.y = currentPosition.y + parseFloat(point[5]);
        }else{
            this.x1 = parseFloat(point[0]);
            this.y1 = parseFloat(point[1]);
            this.x2 = parseFloat(point[2]);
            this.y2 = parseFloat(point[3]);
            this.x = parseFloat(point[4]);
            this.y = parseFloat(point[5]);
        }
        currentPosition.x = this.x;
        currentPosition.y = this.y;
    }
    public toString(){
        return this.x1.toFixed(3) + ',' + this.y1.toFixed(3) + ' ' + this.x2.toFixed(3) + ',' + this.y2.toFixed(3) + ' ' + this.x.toFixed(3) + ',' + this.y.toFixed(3);
    }
    public midpoint(x:number, y:number): any{
        let m1x = (x + this.x1)/2;
        let m1y = (y + this.y1)/2;
        let m2x = (this.x1 + this.x2)/2;
        let m2y = (this.y1 + this.y2)/2;
        let m3x = (this.x + this.x2)/2;
        let m3y = (this.y + this.y2)/2;
        
        let m12x = (m1x + m2x)/2;
        let m12y = (m1y + m2y)/2;
        let m23x = (m2x + m3x)/2;
        let m23y = (m2y + m3y)/2;

        let mx = (m12x + m23x)/2;
        let my = (m12y + m23y)/2;
        return { x: mx, y: my };
    }
    public scale(factor): any{
        this.x1 = this.x1 * factor;
        this.y1 = this.y1 * factor;
        this.x2 = this.x2 * factor;
        this.y2 = this.y2 * factor;
        this.x = this.x * factor;
        this.y = this.y * factor;
    }
    public translate(x: number, y :number){
        this.x1 += x; 
        this.y1 += y; 
        this.x2 += x;
        this.y2 += y;
        this.x += x;
        this.y += y;
    }
}