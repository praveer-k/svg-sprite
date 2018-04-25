export class T{
    x: number;
    y: number;
    constructor(instruction, point, currentPosition={x:0, y:0}){
        if(instruction=='t'){
            this.x = currentPosition.x + parseFloat(point[0]);
            this.y = currentPosition.y + parseFloat(point[1]);
        }else{
            this.x = parseFloat(point[0]);
            this.y = parseFloat(point[1]);
        }
        currentPosition.x = this.x;
        currentPosition.y = this.y;
    }
    public toString(){
        return this.x.toFixed(3) + ',' + this.y.toFixed(3);
    }
    public midpoint(cpx: number, cpy:number, x:number, y:number): any{
        let dx = Math.abs(Math.abs(x) - Math.abs(cpx));
        let dy = Math.abs(Math.abs(y) - Math.abs(cpy));
        let x1 = (cpx > x) ? x-dx : x+dx;
        let y1 = (cpy > y) ? y-dy : y+dy;
        let m1x = (x + x1)/2;
        let m1y = (y + y1)/2;
        let m2x = (this.x + x1)/2;
        let m2y = (this.y + y1)/2;
        let mx = (m1x + m2x)/2;
        let my = (m1y + m2y)/2;
        return { x: mx, y: my };
    }
    public scale(factor): any{
        this.x = this.x * factor;
        this.y = this.y * factor;
    }
    public translate(x: number, y :number){
        this.x += x;
        this.y += y;
    }
}