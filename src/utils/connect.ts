import config from "config";
import mongoose from "mongoose";
import logger from "./logger";

const connect = async () => {
  const dbUri = config.get<string>("dbUri");

  try {
    await mongoose.connect(dbUri);
    logger.info("Database connected");
  } catch (error: any) {
    logger.error(error);
    process.exit(1);
  }
};

export default connect;
