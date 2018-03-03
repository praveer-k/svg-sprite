import { Shape } from './Shape';
import { Rectangle } from './Rectangle';
import { Circle } from './Circle';
// import './Ellipse';
// import './Line';
// import './Polygon';
// import './Polyline';
import { Text } from './Text';
import { Path } from './Path';

export class Shapes {
    public getShape(shapeName: string): Shape{
        let shape;
        switch(shapeName.toLowerCase()){
            case 'rectangle':
                shape = new Rectangle();
            break;
            case 'circle':
                shape = new Circle();
            break;
            case 'text':
                shape = new Text();
            break;
            case 'path':
                shape = new Path();
            break;
        }
        return shape;
    }
}