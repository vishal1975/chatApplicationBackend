import { createApp, logger } from "./src/index.js";
import { createServer } from "node:http";
import { format, transports } from "winston";

logger.add(
  new transports.Console({
    format: format.combine(format.timestamp(), format.splat(), format.json()),
  }),
);

const httpServer = createServer();

const { close } = await createApp(httpServer, {
  postgres: {
    host: "db",
    user: "postgres",
    password: "123456",
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false // Necessary for Heroku SSL connections
    },
  },
  sessionSecrets: ["123456"],
});

process.on("SIGTERM", async () => {
  logger.info("SIGTERM signal received");

  await close();
});
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  logger.info("server listening at http://localhost:3000");
});
