import { Request, Response, NextFunction } from "express";
import { User } from "../models/User";

export default async function canAccessUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.user.isManager && req.user._id.toHexString() !== req.params.id) {
    return res.status(403).send("Forbidden: Access is denied.");
  }

  if (req.user.isManager) {
    const employees = await User.find({ reportTo: req.user._id });

    if (
      !employees
        .map((employee) => employee._id.toHexString())
        .includes(req.params.id)
    )
      return res.status(403).send("Forbidden: Access is denied.");
  }

  next();
}
