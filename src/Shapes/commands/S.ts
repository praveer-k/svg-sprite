export class S{
    x2: number;
    y2: number;
    x: number;
    y: number;
    constructor(instruction, point, currentPosition={x:0, y:0}){
        if(instruction=='s'){
            this.x2 = currentPosition.x + parseFloat(point[0]);
            this.y2 = currentPosition.y + parseFloat(point[1]);
            this.x = currentPosition.x + parseFloat(point[2]);
            this.y = currentPosition.y + parseFloat(point[3]);
        }else{
            this.x2 = parseFloat(point[0]);
            this.y2 = parseFloat(point[1]);
            this.x = parseFloat(point[2]);
            this.y = parseFloat(point[3]);
        }
        currentPosition.x = this.x;
        currentPosition.y = this.y;
    }
    public toString(){
        return this.x2.toFixed(3) + ',' + this.y2.toFixed(3) + ' ' + this.x.toFixed(3) + ',' + this.y.toFixed(3);
    }
    public midpoint(cpx: number, cpy:number, x:number, y:number): any{
        let dx = Math.abs(Math.abs(x) - Math.abs(cpx));
        let dy = Math.abs(Math.abs(y) - Math.abs(cpy));
        let x1 = (cpx > x) ? x-dx : x+dx;
        let y1 = (cpy > y) ? y-dy : y+dy;
        // console.log('midpoint in S ', cpx, cpy, x, y, dx, dy, x1, y1);
        let m1x = (x + x1)/2;
        let m1y = (y + y1)/2;
        let m2x = (x1 + this.x2)/2;
        let m2y = (y1 + this.y2)/2;
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
        this.x2 = this.x2 * factor;
        this.y2 = this.y2 * factor;
        this.x = this.x * factor;
        this.y = this.y * factor;
    }
    public translate(x: number, y :number){
        this.x2 += x;
        this.y2 += y;
        this.x += x;
        this.y += y;
    }
}