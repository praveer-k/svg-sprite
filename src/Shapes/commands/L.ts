export class L{
    x: number;
    y: number;
    constructor(instruction, point, currentPosition){
        if(instruction=='l'){
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
    public scale(factor): any{
        this.x = this.x * factor;
        this.y = this.y * factor;
    }
    public translate(x: number, y :number){
        this.x += x;
        this.y += y;
    }
}