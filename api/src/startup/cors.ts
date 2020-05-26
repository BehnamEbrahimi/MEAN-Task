import cors from "cors";
import { Application } from "express";

export default function (app: Application) {
  app.use(cors());
}
