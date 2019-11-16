(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./m", "./h", "./v", "./l", "./c", "./q", "./s", "./t", "./a", "./z"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    // Line and Move commands
    var m_1 = require("./m");
    exports.M = m_1.M;
    var h_1 = require("./h");
    exports.H = h_1.H;
    var v_1 = require("./v");
    exports.V = v_1.V;
    var l_1 = require("./l");
    exports.L = l_1.L;
    // bezier curves
    var c_1 = require("./c");
    exports.C = c_1.C;
    var q_1 = require("./q");
    exports.Q = q_1.Q;
    var s_1 = require("./s");
    exports.S = s_1.S;
    var t_1 = require("./t");
    exports.T = t_1.T;
    // Arcs and Circles
    var a_1 = require("./a");
    exports.A = a_1.A;
    // Connect back to initial or complete shape command
    var z_1 = require("./z");
    exports.Z = z_1.Z;
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
                    obj = new m_1.M(command, point, currentPosition);
                    break;
                case 'L':
                    obj = new l_1.L(command, point, currentPosition);
                    break;
                case 'H':
                    obj = new h_1.H(command, point, currentPosition);
                    break;
                case 'V':
                    obj = new v_1.V(command, point, currentPosition);
                    break;
                case 'Z':
                    obj = new z_1.Z();
                    break;
                case 'C':
                    obj = new c_1.C(command, point, currentPosition);
                    break;
                case 'S':
                    obj = new s_1.S(command, point, currentPosition);
                    break;
                case 'Q':
                    obj = new q_1.Q(command, point, currentPosition);
                    break;
                case 'T':
                    obj = new t_1.T(command, point, currentPosition);
                    break;
                case 'A':
                    obj = new a_1.A(command, point, currentPosition);
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
