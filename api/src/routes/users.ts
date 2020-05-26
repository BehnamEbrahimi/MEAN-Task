import { Router, Request, Response } from "express";
import mongoose from "mongoose";
import { User, validateUser, validateLogin } from "../models/User";
import { Task } from "../models/Task";
import auth from "../middlewares/auth";
import manager from "../middlewares/manager";
import validate from "../middlewares/validate";
import canAccessUser from "../middlewares/canAccessUser";

const router = Router();

// Register
router.post(
  "/",
  validate(validateUser),
  async (req: Request, res: Response) => {
    let user = await User.findOne({ employeeId: req.body.employeeId });
    if (user) return res.status(400).send("User already registered");

    if (!req.body.isManager) {
      if (!mongoose.Types.ObjectId.isValid(req.body.reportTo))
        return res.status(400).send('Valid "reportTo" is required');

      const reportTo = await User.findById(req.body.reportTo);

      if (!reportTo || !reportTo.isManager)
        return res.status(400).send('Valid "reportTo" is required');
    } else {
      const _id = mongoose.Types.ObjectId();
      req.body.reportTo = _id;
      req.body._id = _id;
    }

    user = new User(req.body);

    await user.save();

    const token = await user.generateAuthToken();

    res.status(201).send({ user, token });
  }
);

// Login
router.post(
  "/login",
  validate(validateLogin),
  async (req: Request, res: Response) => {
    const user = await User.findByCredentials(
      req.body.employeeId,
      req.body.password
    );
    if (!user) return res.status(400).send("Invalid employeeId or password");

    const token = await user.generateAuthToken();

    res.send({ user, token });
  }
);

// Me
router.get("/me", auth, async (req: Request, res: Response) => {
  res.send(req.user);
});

// List all employees
router.get("/", [auth], async (req: Request, res: Response) => {
  if (req.user.isManager) {
    const employees = await User.find({ reportTo: req.user._id });

    return res.send(employees);
  }

  res.send([req.user]);
});

// List all managers
router.get("/managers", async (req: Request, res: Response) => {
  const managers = await User.find({ isManager: true });

  res.send(managers);
});

// Get a user
router.get(
  "/:id",
  [auth, canAccessUser],
  async (req: Request, res: Response) => {
    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(404).send("User not found");
    }

    res.send(user);
  }
);

// Update user
router.put(
  "/:id",
  [auth, canAccessUser, validate(validateUser)],
  async (req: Request, res: Response) => {
    let user = await User.findOne({ employeeId: req.body.employeeId });
    if (user && user._id.toHexString() !== req.params.id)
      return res.status(400).send("Duplicated employeeId");

    user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).send("User not found");
    }

    if (user.isManager !== req.body.isManager)
      return res.status(400).send('Cannot change "isManager"');

    if (!user.isManager) {
      if (!mongoose.Types.ObjectId.isValid(req.body.reportTo))
        return res.status(400).send('Valid "reportTo" is required');

      const reportTo = await User.findById(req.body.reportTo);

      if (!reportTo || !reportTo.isManager)
        return res.status(400).send('Valid "reportTo" is required');
    } else {
      req.body.reportTo = req.params.id;
      req.body._id = req.params.id;
    }

    user.name = req.body.name;
    user.employeeId = req.body.employeeId;
    user.password = req.body.password;
    user.reportTo = req.body.reportTo;

    await user.save();

    res.send(user);
  }
);

// Delete user
router.delete(
  "/:id",
  [auth, canAccessUser],
  async (req: Request, res: Response) => {
    const user = await User.findOneAndDelete({ _id: req.params.id });
    const employees = await User.find({ reportTo: req.params.id });
    await User.deleteMany({ reportTo: req.params.id });
    await Task.deleteMany({ assignee: req.params.id });
    employees.forEach(async (employee) => {
      await Task.deleteMany({ assignee: employee._id.toHexString() });
    });

    if (!user) {
      res.status(404).send("User not found");
    }

    res.send(user);
  }
);

export default router;
