import { Document, model, Schema, Types } from "mongoose";
import Joi from "@hapi/joi";
import { IUser } from "./User";

export enum taskStatus {
  pending = "pending",
  ongoing = "ongoing",
  completed = "completed",
}

export interface ITask extends Document {
  description: string;
  status: taskStatus;
  assignee: any;
  date: Date;
}

const taskSchema = new Schema({
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
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  date: {
    type: Date,
    required: true,
  },
});

const Task = model<ITask>("Task", taskSchema);

const validateTask = (task: ITask) => {
  const schema = Joi.object({
    description: Joi.string().min(3).required(),
    assignee: Joi.string().required(),
    date: Joi.date().required(),
    status: Joi.valid(
      taskStatus.pending,
      taskStatus.ongoing,
      taskStatus.completed
    ),
  });

  return (
    schema.validate(task).error &&
    schema.validate(task).error!.details[0].message
  );
};

const validateStatus = (task: ITask) => {
  const schema = Joi.object({
    status: Joi.valid(
      taskStatus.pending,
      taskStatus.ongoing,
      taskStatus.completed
    ).required(),
  });

  return (
    schema.validate(task).error &&
    schema.validate(task).error!.details[0].message
  );
};

export { Task, validateTask, validateStatus };
