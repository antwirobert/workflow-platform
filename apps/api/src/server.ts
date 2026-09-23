import app from "./app";
import { config } from "./config/env";
import { startJobSystem } from "./jobs";

app.listen(config.port, async () => {
  console.log(
    `Server is running on port ${config.port} in ${config.nodeEnv} mode`,
  );
  await startJobSystem();
});
