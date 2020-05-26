import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "config";
import { User } from "../models/User";

export default async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.header("Authorization")!.replace("Bearer ", "");
    const decoded: any = jwt.verify(token, config.get("jwtPrivateKey"));
    const user = await User.findById(decoded._id);

    if (!user) {
      throw new Error();
    }

    req.token = token;
    req.user = user;
    next();
  } catch (e) {
    res.status(401).send("Please authenticate");
  }
}
