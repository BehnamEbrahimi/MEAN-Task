"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function error(err, req, res, next) {
    console.error(err.message, err);
    res.status(500).send("Something failed");
}
exports.default = error;
