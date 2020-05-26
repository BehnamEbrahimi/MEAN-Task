"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(validator) {
    return function (req, res, next) {
        var error = validator(req.body);
        if (error)
            return res.status(400).send(error);
        next();
    };
}
exports.default = default_1;
