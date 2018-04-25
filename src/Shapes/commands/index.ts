// Line and Move commands
import { M } from './M';
import { H } from './H';
import { V } from './V';
import { L } from './L';
// bezier curves
import { C } from './C';
import { Q } from './Q';
import { S } from './S';
import { T } from './T';
// Arcs and Circles
import { A } from './A';
// Connect back to initial or complete shape command
import { Z } from './Z';

type commands = M|L|H|V|Z|C|Q|S|T|A;

class Command{
    steps: Array<commands>;
    constructor(cmdString, currentPosition){
        this.steps = new Array<commands>();
        let command = cmdString.trim()[0];
        let coords = cmdString.substr(1).replace(/-/g, ' -').replace(/,/g, ' ').trim().split(' ');
        let chunkSize = (this.getChunkSize(command)==0) ? 1:this.getChunkSize(command);
        // console.log(command, coords, chunkSize, coords.length);
        for (let i=0, j=coords.length; i<j; i+=chunkSize) {
            let temp = coords.slice(i, i+chunkSize);
            // console.log(temp, this.steps);
            if(temp.length == chunkSize){
                this.steps.push(this.getCommand(command, temp, currentPosition));
            }
        }
    }
    public getSize(){
        return this.steps.length;
    }
    public get all(): any {
        return this.steps;
    }
    public getCommand(command, point, currentPosition): any{
        var obj: any;
        switch(command.toUpperCase()){
            case 'M':
                obj = new M(command, point, currentPosition);
            break;
            case 'L':
                obj = new L(command, point, currentPosition);
            break;
            case 'H':
                obj = new H(command, point, currentPosition);
            break;
            case 'V':
                obj = new V(command, point, currentPosition);
            break;
            case 'Z':
                obj = new Z();
            break;
            case 'C':
                obj = new C(command, point, currentPosition);
            break;
            case 'S':
                obj = new S(command, point, currentPosition);
            break;
            case 'Q':
                obj = new Q(command, point, currentPosition);
            break;
            case 'T':
                obj = new T(command, point, currentPosition);
            break;
            case 'A':
                obj = new A(command, point, currentPosition);
            break;
        }
        return obj;
    }
    public getChunkSize(command): any{
        let chunkSize = 0;
        switch(command.toUpperCase()){
            case 'H': 
            case 'V':
                chunkSize = 1;
            break;
            case 'M':
            case 'L':
            case 'T':
                chunkSize = 2;
            break;
            case 'Q':
            case 'S':
                chunkSize = 4;
            break;
            case 'C':
                chunkSize = 6;
            break;
            case 'A':
                chunkSize = 7;
            break;
            case 'Z':
                chunkSize = 0;
            break;
        }
        return chunkSize;
    }
}

export { A, C, H, L, M, Q, S, T, V, Z, Command }