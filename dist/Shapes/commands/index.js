(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./M", "./H", "./V", "./L", "./C", "./Q", "./S", "./T", "./A", "./Z"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    // Line and Move commands
    var M_1 = require("./M");
    exports.M = M_1.M;
    var H_1 = require("./H");
    exports.H = H_1.H;
    var V_1 = require("./V");
    exports.V = V_1.V;
    var L_1 = require("./L");
    exports.L = L_1.L;
    // bezier curves
    var C_1 = require("./C");
    exports.C = C_1.C;
    var Q_1 = require("./Q");
    exports.Q = Q_1.Q;
    var S_1 = require("./S");
    exports.S = S_1.S;
    var T_1 = require("./T");
    exports.T = T_1.T;
    // Arcs and Circles
    var A_1 = require("./A");
    exports.A = A_1.A;
    // Connect back to initial or complete shape command
    var Z_1 = require("./Z");
    exports.Z = Z_1.Z;
    var Command = /** @class */ (function () {
        function Command(cmdString, currentPosition) {
            this.steps = new Array();
            var command = cmdString.trim()[0];
            var coords = cmdString.substr(1).replace(/-/g, ' -').replace(/,/g, ' ').trim().split(' ');
            var chunkSize = (this.getChunkSize(command) == 0) ? 1 : this.getChunkSize(command);
            // console.log(command, coords, chunkSize, coords.length);
            for (var i = 0, j = coords.length; i < j; i += chunkSize) {
                var temp = coords.slice(i, i + chunkSize);
                // console.log(temp, this.steps);
                if (temp.length == chunkSize) {
                    this.steps.push(this.getCommand(command, temp, currentPosition));
                }
            }
        }
        Command.prototype.getSize = function () {
            return this.steps.length;
        };
        Object.defineProperty(Command.prototype, "all", {
            get: function () {
                return this.steps;
            },
            enumerable: true,
            configurable: true
        });
        Command.prototype.getCommand = function (command, point, currentPosition) {
            var obj;
            switch (command.toUpperCase()) {
                case 'M':
                    obj = new M_1.M(command, point, currentPosition);
                    break;
                case 'L':
                    obj = new L_1.L(command, point, currentPosition);
                    break;
                case 'H':
                    obj = new H_1.H(command, point, currentPosition);
                    break;
                case 'V':
                    obj = new V_1.V(command, point, currentPosition);
                    break;
                case 'Z':
                    obj = new Z_1.Z();
                    break;
                case 'C':
                    obj = new C_1.C(command, point, currentPosition);
                    break;
                case 'S':
                    obj = new S_1.S(command, point, currentPosition);
                    break;
                case 'Q':
                    obj = new Q_1.Q(command, point, currentPosition);
                    break;
                case 'T':
                    obj = new T_1.T(command, point, currentPosition);
                    break;
                case 'A':
                    obj = new A_1.A(command, point, currentPosition);
                    break;
            }
            return obj;
        };
        Command.prototype.getChunkSize = function (command) {
            var chunkSize = 0;
            switch (command.toUpperCase()) {
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
        };
        return Command;
    }());
    exports.Command = Command;
});
