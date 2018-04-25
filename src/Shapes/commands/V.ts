export class V{
    y: number;
    constructor(instruction, point, currentPosition={x:0, y:0}){
        if(instruction=='v'){
            this.y = currentPosition.y + parseFloat(point[0]);
        }else{
            this.y = parseFloat(point[0]);
        }
        currentPosition.y = this.y;
    }
    public toString(){
        return this.y.toFixed(3);
    }
    public scale(factor): any{
        this.y = this.y * factor;
    }
    public translate(x=0, y :number){
        this.y += y;
    }
}