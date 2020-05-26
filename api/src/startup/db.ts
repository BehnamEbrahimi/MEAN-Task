import mongoose from "mongoose";
import config from "config";

export default function () {
  const db = config.get<string>("db");
  mongoose
    .connect(db, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    })
    .then(() => console.log(`Connected to ${db}...`));
}
