"use strict";
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
var validate_1 = __importDefault(require("../middlewares/validate"));
var canAccessUser_1 = __importDefault(require("../middlewares/canAccessUser"));
var router = express_1.Router();
// Register
router.post("/", validate_1.default(User_1.validateUser), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, reportTo, _id, token;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, User_1.User.findOne({ employeeId: req.body.employeeId })];
            case 1:
                user = _a.sent();
                if (user)
                    return [2 /*return*/, res.status(400).send("User already registered")];
                if (!!req.body.isManager) return [3 /*break*/, 3];
                if (!mongoose_1.default.Types.ObjectId.isValid(req.body.reportTo))
                    return [2 /*return*/, res.status(400).send('Valid "reportTo" is required')];
                return [4 /*yield*/, User_1.User.findById(req.body.reportTo)];
            case 2:
                reportTo = _a.sent();
                if (!reportTo || !reportTo.isManager)
                    return [2 /*return*/, res.status(400).send('Valid "reportTo" is required')];
                return [3 /*break*/, 4];
            case 3:
                _id = mongoose_1.default.Types.ObjectId();
                req.body.reportTo = _id;
                req.body._id = _id;
                _a.label = 4;
            case 4:
                user = new User_1.User(req.body);
                return [4 /*yield*/, user.save()];
            case 5:
                _a.sent();
                return [4 /*yield*/, user.generateAuthToken()];
            case 6:
                token = _a.sent();
                res.status(201).send({ user: user, token: token });
                return [2 /*return*/];
        }
    });
}); });
// Login
router.post("/login", validate_1.default(User_1.validateLogin), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, token;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, User_1.User.findByCredentials(req.body.employeeId, req.body.password)];
            case 1:
                user = _a.sent();
                if (!user)
                    return [2 /*return*/, res.status(400).send("Invalid employeeId or password")];
                return [4 /*yield*/, user.generateAuthToken()];
            case 2:
                token = _a.sent();
                res.send({ user: user, token: token });
                return [2 /*return*/];
        }
    });
}); });
// Me
router.get("/me", auth_1.default, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        res.send(req.user);
        return [2 /*return*/];
    });
}); });
// List all employees
router.get("/", [auth_1.default], function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var employees;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!req.user.isManager) return [3 /*break*/, 2];
                return [4 /*yield*/, User_1.User.find({ reportTo: req.user._id })];
            case 1:
                employees = _a.sent();
                return [2 /*return*/, res.send(employees)];
            case 2:
                res.send([req.user]);
                return [2 /*return*/];
        }
    });
}); });
// List all managers
router.get("/managers", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var managers;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, User_1.User.find({ isManager: true })];
            case 1:
                managers = _a.sent();
                res.send(managers);
                return [2 /*return*/];
        }
    });
}); });
// Get a user
router.get("/:id", [auth_1.default, canAccessUser_1.default], function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, User_1.User.findById(req.params.id)];
            case 1:
                user = _a.sent();
                if (!user) {
                    res.status(404).send("User not found");
                }
                res.send(user);
                return [2 /*return*/];
        }
    });
}); });
// Update user
router.put("/:id", [auth_1.default, canAccessUser_1.default, validate_1.default(User_1.validateUser)], function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, reportTo;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, User_1.User.findOne({ employeeId: req.body.employeeId })];
            case 1:
                user = _a.sent();
                if (user && user._id.toHexString() !== req.params.id)
                    return [2 /*return*/, res.status(400).send("Duplicated employeeId")];
                return [4 /*yield*/, User_1.User.findById(req.params.id)];
            case 2:
                user = _a.sent();
                if (!user) {
                    return [2 /*return*/, res.status(404).send("User not found")];
                }
                if (user.isManager !== req.body.isManager)
                    return [2 /*return*/, res.status(400).send('Cannot change "isManager"')];
                if (!!user.isManager) return [3 /*break*/, 4];
                if (!mongoose_1.default.Types.ObjectId.isValid(req.body.reportTo))
                    return [2 /*return*/, res.status(400).send('Valid "reportTo" is required')];
                return [4 /*yield*/, User_1.User.findById(req.body.reportTo)];
            case 3:
                reportTo = _a.sent();
                if (!reportTo || !reportTo.isManager)
                    return [2 /*return*/, res.status(400).send('Valid "reportTo" is required')];
                return [3 /*break*/, 5];
            case 4:
                req.body.reportTo = req.params.id;
                req.body._id = req.params.id;
                _a.label = 5;
            case 5:
                user.name = req.body.name;
                user.employeeId = req.body.employeeId;
                user.password = req.body.password;
                user.reportTo = req.body.reportTo;
                return [4 /*yield*/, user.save()];
            case 6:
                _a.sent();
                res.send(user);
                return [2 /*return*/];
        }
    });
}); });
// Delete user
router.delete("/:id", [auth_1.default, canAccessUser_1.default], function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, employees;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, User_1.User.findOneAndDelete({ _id: req.params.id })];
            case 1:
                user = _a.sent();
                return [4 /*yield*/, User_1.User.find({ reportTo: req.params.id })];
            case 2:
                employees = _a.sent();
                return [4 /*yield*/, User_1.User.deleteMany({ reportTo: req.params.id })];
            case 3:
                _a.sent();
                return [4 /*yield*/, Task_1.Task.deleteMany({ assignee: req.params.id })];
            case 4:
                _a.sent();
                employees.forEach(function (employee) { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, Task_1.Task.deleteMany({ assignee: employee._id.toHexString() })];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                if (!user) {
                    res.status(404).send("User not found");
                }
                res.send(user);
                return [2 /*return*/];
        }
    });
}); });
exports.default = router;
