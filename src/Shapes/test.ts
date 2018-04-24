class Point{
    x: number;
    y: number;
    constructor(x: number, y: number){
        this.x = x;
        this.y = y;
        
    }
}
class controlPoint{
    lp: Point; // left directive
    mp: Point; // main point
    rp: Point; // right directive
    constructor(p:Point, lp: Point, rp: Point){
        this.mp = p;
        this.lp = (lp===undefined) ? new Point(p.x, p.y) : lp;
        this.rp = (rp===undefined) ? new Point(p.x, p.y) : rp;
    }
}
type Pointer<controlPoint> = {
    readonly [ P in keyof controlPoint ]: controlPoint[P];
}
class Canvas{
    history: [Pointer<controlPoint>];
    curIndex: number;
    constructor(){
        this.history.push();
        this.curIndex = -1;
    }
    public curPos(): any{
        let cp : controlPoint;
        this.history[this.history.length - 1];
    }
    public moveTo(x: number, y: number): any{
        let p =  new controlPoint(new Point(x, y), new Point(x, y), new Point(x, y));
        this.history.push(p);
        return this;
    }
}
let c = new Canvas();
c.moveTo(0,10);
console.log(c.curPos());