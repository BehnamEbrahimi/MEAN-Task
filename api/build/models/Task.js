"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var joi_1 = __importDefault(require("@hapi/joi"));
var taskStatus;
(function (taskStatus) {
    taskStatus["pending"] = "pending";
    taskStatus["ongoing"] = "ongoing";
    taskStatus["completed"] = "completed";
})(taskStatus = exports.taskStatus || (exports.taskStatus = {}));
var taskSchema = new mongoose_1.Schema({
    description: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
    },
    status: {
        type: String,
        required: true,
        default: taskStatus.pending,
        enum: [taskStatus.pending, taskStatus.ongoing, taskStatus.completed],
    },
    assignee: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    date: {
        type: Date,
        required: true,
    },
});
var Task = mongoose_1.model("Task", taskSchema);
exports.Task = Task;
var validateTask = function (task) {
    var schema = joi_1.default.object({
        description: joi_1.default.string().min(3).required(),
        assignee: joi_1.default.string().required(),
        date: joi_1.default.date().required(),
        status: joi_1.default.valid(taskStatus.pending, taskStatus.ongoing, taskStatus.completed),
    });
    return (schema.validate(task).error &&
        schema.validate(task).error.details[0].message);
};
exports.validateTask = validateTask;
var validateStatus = function (task) {
    var schema = joi_1.default.object({
        status: joi_1.default.valid(taskStatus.pending, taskStatus.ongoing, taskStatus.completed).required(),
    });
    return (schema.validate(task).error &&
        schema.validate(task).error.details[0].message);
};
exports.validateStatus = validateStatus;
