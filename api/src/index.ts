import app from "./app";
import config from "config";

const PORT = process.env.PORT || config.get("port");

app.listen(PORT, () => {
  console.log(`Server is up on port ${PORT}`);
});
