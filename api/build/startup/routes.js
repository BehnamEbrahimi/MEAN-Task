"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var users_1 = __importDefault(require("../routes/users"));
var tasks_1 = __importDefault(require("../routes/tasks"));
var error_1 = __importDefault(require("../middlewares/error"));
function default_1(app) {
    app.use(express_1.default.json());
    app.use("/api/users", users_1.default);
    app.use("/api/tasks", tasks_1.default);
    app.use(error_1.default);
}
exports.default = default_1;
