import config from "config";
import express from "express";
import deserializeUser from "./middleware/deserializeUser";
import routes from "./routes";
import connect from "./utils/connect";
import logger from "./utils/logger";

const port = config.get<string>("port");
const app = express();

app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
app.use(deserializeUser);

app.listen(port, async () => {
  logger.info(`Server is running at http://localhost:${port}`);

  await connect();

  routes(app);
});
