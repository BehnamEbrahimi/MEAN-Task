"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var logging_1 = __importDefault(require("./startup/logging"));
var cors_1 = __importDefault(require("./startup/cors"));
var routes_1 = __importDefault(require("./startup/routes"));
var db_1 = __importDefault(require("./startup/db"));
var config_1 = __importDefault(require("./startup/config"));
var prod_1 = __importDefault(require("./startup/prod"));
var app = express_1.default();
logging_1.default();
cors_1.default(app);
routes_1.default(app);
db_1.default();
config_1.default();
if (app.get("env") === "production") {
    console.log("Prod environment");
    prod_1.default(app);
}
if (app.get("env") === "development") {
    console.log("Dev environment");
}
exports.default = app;
