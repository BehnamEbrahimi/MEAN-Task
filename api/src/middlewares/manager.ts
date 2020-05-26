import { Request, Response, NextFunction } from "express";

export default function manager(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.user.isManager)
    return res.status(403).send("Forbidden: Access is denied.");
  next();
}
