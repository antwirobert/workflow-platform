import app from "./app";
import { config } from "./config/env";
import { startJobSystem } from "./jobs";
import logger from "./logger";

app.listen(config.port, async () => {
  logger.info("Server started", { port: config.port, env: config.nodeEnv });
  await startJobSystem();
});
