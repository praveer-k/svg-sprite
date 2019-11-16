import { Shape } from './shape';
import { Rectangle } from './rectangle';
import { Circle } from './circle';
import { Ellipse } from './ellipse';
// import './Line';
// import './Polygon';
// import './Polyline';
import { Text } from './text';
import { Path } from './path';

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
            case 'ellipse':
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