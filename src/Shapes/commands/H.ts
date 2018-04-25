export class H{
    x: number;
    constructor(instruction, point, currentPosition={x:0, y:0}){
        if(instruction=='h'){
            this.x = currentPosition.x + parseFloat(point[0]);
        }else{
            this.x = parseFloat(point[0]);
        }
        currentPosition.x = this.x;
    }
    public toString(){
        return this.x.toFixed(3);
    }
    public scale(factor): any{
        this.x = this.x * factor;
    }
    public translate(x: number, y=0){
        this.x += x;
    }
}