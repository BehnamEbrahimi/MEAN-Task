"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function manager(req, res, next) {
    if (!req.user.isManager)
        return res.status(403).send("Forbidden: Access is denied.");
    next();
}
exports.default = manager;
