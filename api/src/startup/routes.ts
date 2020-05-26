import express, { Application } from "express";
import usersRouter from "../routes/users";
import tasksRouter from "../routes/tasks";
import error from "../middlewares/error";

export default function (app: Application) {
  app.use(express.json());
  app.use("/api/users", usersRouter);
  app.use("/api/tasks", tasksRouter);
  app.use(error);
}
