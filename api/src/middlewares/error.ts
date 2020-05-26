import { Request, Response, NextFunction } from "express";

export default function error(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error(err.message, err);

  res.status(500).send("Something failed");
}
