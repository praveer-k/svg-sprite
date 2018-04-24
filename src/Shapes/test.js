var Point = /** @class */ (function () {
    function Point(x, y) {
        this.x = x;
        this.y = y;
    }
    return Point;
}());
var controlPoint = /** @class */ (function () {
    function controlPoint(p, lp, rp) {
        this.mp = p;
        this.lp = (lp === undefined) ? new Point(p.x, p.y) : lp;
        this.rp = (rp === undefined) ? new Point(p.x, p.y) : rp;
    }
    return controlPoint;
}());
var Canvas = /** @class */ (function () {
    function Canvas() {
        this.history.push();
        this.curIndex = -1;
    }
    Canvas.prototype.curPos = function () {
        var cp;
        this.history[this.history.length - 1];
    };
    Canvas.prototype.moveTo = function (x, y) {
        var p = new controlPoint(new Point(x, y), new Point(x, y), new Point(x, y));
        this.history.push(p);
        return this;
    };
    return Canvas;
}());
var c = new Canvas();
c.moveTo(0, 10);
console.log(c.curPos());
