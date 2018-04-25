export class Q{
    x1: number;
    y1: number;
    x: number;
    y: number;
    constructor(instruction, point, currentPosition={x:0, y:0}){
        if(instruction=='q'){
            this.x1 = currentPosition.x + parseFloat(point[0]);
            this.y1 = currentPosition.y + parseFloat(point[1]);
            this.x = currentPosition.x + parseFloat(point[2]);
            this.y = currentPosition.y + parseFloat(point[3]);
        }else{
            this.x1 = parseFloat(point[0]);
            this.y1 = parseFloat(point[1]);
            this.x = parseFloat(point[2]);
            this.y = parseFloat(point[3]);
        }
        currentPosition.x = this.x;
        currentPosition.y = this.y;
    }
    public toString(){
        return this.x1.toFixed(3) + ',' + this.y1.toFixed(3) + ' ' + this.x.toFixed(3) + ',' + this.y.toFixed(3);
    }
    public midpoint(x:number, y:number): any{
        let m1x = (x + this.x1)/2;
        let m1y = (y + this.y1)/2;
        let m2x = (this.x + this.x1)/2;
        let m2y = (this.y + this.y1)/2;
        let mx = (m1x + m2x)/2;
        let my = (m1y + m2y)/2;
        return { x: mx, y: my };
    }
    public scale(factor): any{
        this.x1 = this.x1 * factor;
        this.y1 = this.y1 * factor;
        this.x = this.x * factor;
        this.y = this.y * factor;
    }
    public translate(x: number, y :number){
        this.x1 += x; 
        this.y1 += y;
        this.x += x;
        this.y += y;
    }
}