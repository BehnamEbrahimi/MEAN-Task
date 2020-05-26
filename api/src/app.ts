import express from "express";
import logging from "./startup/logging";
import cors from "./startup/cors";
import routes from "./startup/routes";
import db from "./startup/db";
import config from "./startup/config";
import prod from "./startup/prod";

const app = express();
logging();
cors(app);
routes(app);
db();
config();

if (app.get("env") === "production") {
  console.log("Prod environment");
  prod(app);
}

if (app.get("env") === "development") {
  console.log("Dev environment");
}

export default app;
