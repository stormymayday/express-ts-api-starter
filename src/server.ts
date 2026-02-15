import "source-map-support/register.js";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { isTestEnv, isProd, env } from "./env.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { rateLimit } from "express-rate-limit";

const limiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  limit: env.RATE_LIMIT_MAX_REQUESTS,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  ipv6Subnet: 56,
});

const app = express();

if (!isTestEnv()) {
  app.use(limiter);
}
app.use(helmet());
app.use(
  cors({
    origin:
      env.ALLOWED_ORIGINS === "*"
        ? true
        : env.ALLOWED_ORIGINS.split(",").map((o) => o.trim()),
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  morgan(isProd() ? "combined" : "dev", {
    skip: () => isTestEnv(),
  }),
);

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    service: "Express API",
  });
});

app.use(errorHandler);

export { app };
export default app;
