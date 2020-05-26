import "express-async-errors";

export default function () {
  process.on("uncaughtException", (ex: Error) => {
    console.error(ex.message, ex);
    process.exit(1);
  });

  process.on("unhandledRejection", (ex: Error) => {
    console.error(ex.message, ex);
    process.exit(1);
  });
}
