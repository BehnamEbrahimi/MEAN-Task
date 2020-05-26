"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("express-async-errors");
function default_1() {
    process.on("uncaughtException", function (ex) {
        console.error(ex.message, ex);
        process.exit(1);
    });
    process.on("unhandledRejection", function (ex) {
        console.error(ex.message, ex);
        process.exit(1);
    });
}
exports.default = default_1;
