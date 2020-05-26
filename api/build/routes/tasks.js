"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var mongoose_1 = __importDefault(require("mongoose"));
var User_1 = require("../models/User");
var Task_1 = require("../models/Task");
var auth_1 = __importDefault(require("../middlewares/auth"));
var manager_1 = __importDefault(require("../middlewares/manager"));
var validate_1 = __importDefault(require("../middlewares/validate"));
var router = express_1.Router();
// Create task
router.post("/", [auth_1.default, manager_1.default, validate_1.default(Task_1.validateTask)], function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var assignee, task;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!mongoose_1.default.Types.ObjectId.isValid(req.body.assignee))
                    return [2 /*return*/, res.status(400).send('Valid "assignee" is required')];
                return [4 /*yield*/, User_1.User.findById(req.body.assignee)];
            case 1:
                assignee = _a.sent();
                if (!assignee || assignee.reportTo.toString() !== req.user._id.toString())
                    return [2 /*return*/, res.status(400).send('Valid "assignee" is required')];
                task = new Task_1.Task(__assign({}, req.body));
                return [4 /*yield*/, task.save()];
            case 2:
                _a.sent();
                res.send(task);
                return [2 /*return*/];
        }
    });
}); });
// List tasks
router.get("/", auth_1.default, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var filter, tasks, filtered;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                filter = {};
                if (req.query.assignee) {
                    filter.assignee = req.query.assignee;
                }
                if (req.query.date) {
                    filter.date = new Date(req.query.date);
                }
                if (!req.user.isManager) {
                    filter.assignee = req.user._id;
                }
                return [4 /*yield*/, Task_1.Task.find(__assign({}, filter)).populate("assignee")];
            case 1:
                tasks = _a.sent();
                filtered = tasks.filter(function (task) {
                    return task.assignee.reportTo.toString() === req.user._id.toString() ||
                        task.assignee._id.toString() === req.user._id.toString();
                });
                res.send({ totalItems: filtered.length, items: filtered });
                return [2 /*return*/];
        }
    });
}); });
// Get a task
router.get("/:id", auth_1.default, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var task;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, Task_1.Task.findById(req.params.id).populate("assignee")];
            case 1:
                task = _a.sent();
                if (!task)
                    return [2 /*return*/, res.status(404).send("Task not found")];
                if (task.assignee.reportTo.toString() !== req.user._id.toString() &&
                    task.assignee._id.toString() !== req.user._id.toString())
                    return [2 /*return*/, res.status(403).send("Forbidden: Access is denied.")];
                res.send(task);
                return [2 /*return*/];
        }
    });
}); });
// Update task
router.put("/:id", [auth_1.default, manager_1.default, validate_1.default(Task_1.validateTask)], function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var taskInDb, assignee, task;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, Task_1.Task.findById(req.params.id).populate("assignee")];
            case 1:
                taskInDb = _a.sent();
                if (!taskInDb)
                    return [2 /*return*/, res.status(404).send("Task not found")];
                if (taskInDb.assignee.reportTo.toString() !== req.user._id.toString())
                    return [2 /*return*/, res.status(403).send("Forbidden: Access is denied.")];
                if (!mongoose_1.default.Types.ObjectId.isValid(req.body.assignee))
                    return [2 /*return*/, res.status(400).send('Valid "assignee" is required')];
                return [4 /*yield*/, User_1.User.findById(req.body.assignee)];
            case 2:
                assignee = _a.sent();
                if (!assignee || assignee.reportTo.toString() !== req.user._id.toString())
                    return [2 /*return*/, res.status(400).send('Valid "assignee" is required')];
                return [4 /*yield*/, Task_1.Task.findByIdAndUpdate(req.params.id, __assign({}, req.body), { new: true })];
            case 3:
                task = _a.sent();
                res.send(task);
                return [2 /*return*/];
        }
    });
}); });
// Change task status
router.patch("/:id", [auth_1.default, validate_1.default(Task_1.validateStatus)], function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var task;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, Task_1.Task.findOne({
                    _id: req.params.id,
                    assignee: req.user._id,
                })];
            case 1:
                task = _a.sent();
                if (!task)
                    return [2 /*return*/, res.status(404).send("Task not found")];
                task.status = req.body.status;
                return [4 /*yield*/, task.save()];
            case 2:
                _a.sent();
                res.send(task);
                return [2 /*return*/];
        }
    });
}); });
// Delete task
router.delete("/:id", [auth_1.default, manager_1.default], function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var taskInDb, task;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, Task_1.Task.findById(req.params.id).populate("assignee")];
            case 1:
                taskInDb = _a.sent();
                if (!taskInDb)
                    return [2 /*return*/, res.status(404).send("Task not found")];
                if (taskInDb.assignee.reportTo.toString() !== req.user._id.toString())
                    return [2 /*return*/, res.status(403).send("Forbidden: Access is denied.")];
                return [4 /*yield*/, Task_1.Task.findOneAndDelete({ _id: req.params.id })];
            case 2:
                task = _a.sent();
                res.send(task);
                return [2 /*return*/];
        }
    });
}); });
exports.default = router;
