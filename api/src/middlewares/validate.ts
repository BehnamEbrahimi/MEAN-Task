import { Request, Response, NextFunction } from "express";

export default function (validator: (body: any) => string | undefined) {
  return (req: Request, res: Response, next: NextFunction) => {
    const error = validator(req.body);
    if (error) return res.status(400).send(error);
    next();
  };
}
