import { Router, Request, Response } from "express";
import mongoose from "mongoose";
import { User } from "../models/User";
import { Task, validateTask, validateStatus } from "../models/Task";
import auth from "../middlewares/auth";
import manager from "../middlewares/manager";
import validate from "../middlewares/validate";

const router = Router();

// Create task
router.post(
  "/",
  [auth, manager, validate(validateTask)],
  async (req: Request, res: Response) => {
    if (!mongoose.Types.ObjectId.isValid(req.body.assignee))
      return res.status(400).send('Valid "assignee" is required');

    const assignee = await User.findById(req.body.assignee);
    if (!assignee || assignee.reportTo.toString() !== req.user._id.toString())
      return res.status(400).send('Valid "assignee" is required');

    const task = new Task({
      ...req.body,
    });

    await task.save();

    res.send(task);
  }
);

// List tasks
router.get("/", auth, async (req: Request, res: Response) => {
  const filter: { assignee?: string; date?: Date } = {};

  if (req.query.assignee) {
    filter.assignee = req.query.assignee as string;
  }

  if (req.query.date) {
    filter.date = new Date(<string>req.query.date);
  }

  if (!req.user.isManager) {
    filter.assignee = req.user._id;
  }

  const tasks = await Task.find({ ...filter }).populate("assignee");

  const filtered = tasks.filter(
    (task) =>
      task.assignee.reportTo.toString() === req.user._id.toString() ||
      task.assignee._id.toString() === req.user._id.toString()
  );

  res.send({ totalItems: filtered.length, items: filtered });
});

// Get a task
router.get("/:id", auth, async (req: Request, res: Response) => {
  const task = await Task.findById(req.params.id).populate("assignee");

  if (!task) return res.status(404).send("Task not found");

  if (
    task.assignee.reportTo.toString() !== req.user._id.toString() &&
    task.assignee._id.toString() !== req.user._id.toString()
  )
    return res.status(403).send("Forbidden: Access is denied.");

  res.send(task);
});

// Update task
router.put(
  "/:id",
  [auth, manager, validate(validateTask)],
  async (req: Request, res: Response) => {
    const taskInDb = await Task.findById(req.params.id).populate("assignee");

    if (!taskInDb) return res.status(404).send("Task not found");

    if (taskInDb.assignee.reportTo.toString() !== req.user._id.toString())
      return res.status(403).send("Forbidden: Access is denied.");

    if (!mongoose.Types.ObjectId.isValid(req.body.assignee))
      return res.status(400).send('Valid "assignee" is required');

    const assignee = await User.findById(req.body.assignee);
    if (!assignee || assignee.reportTo.toString() !== req.user._id.toString())
      return res.status(400).send('Valid "assignee" is required');

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true }
    );

    res.send(task);
  }
);

// Change task status
router.patch(
  "/:id",
  [auth, validate(validateStatus)],
  async (req: Request, res: Response) => {
    const task = await Task.findOne({
      _id: req.params.id,
      assignee: req.user._id,
    });

    if (!task) return res.status(404).send("Task not found");

    task.status = req.body.status;
    await task.save();

    res.send(task);
  }
);

// Delete task
router.delete("/:id", [auth, manager], async (req: Request, res: Response) => {
  const taskInDb = await Task.findById(req.params.id).populate("assignee");

  if (!taskInDb) return res.status(404).send("Task not found");

  if (taskInDb.assignee.reportTo.toString() !== req.user._id.toString())
    return res.status(403).send("Forbidden: Access is denied.");

  const task = await Task.findOneAndDelete({ _id: req.params.id });

  res.send(task);
});

export default router;
