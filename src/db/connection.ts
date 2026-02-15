import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { env, isProd } from "../env.js";
import * as schema from "./schema.js";
import { remember } from "../utils/remember.js";

const createPool = () => {
  return new Pool({
    connectionString: env.DB_URL,
    min: env.DB_POOL_MIN,
    max: env.DB_POOL_MAX,
    idleTimeoutMillis: env.DB_IDLE_TIMEOUT,
    connectionTimeoutMillis: env.DB_CONNECTION_TIMEOUT,
  });
};

let client;

if (isProd()) {
  client = createPool();
} else {
  // Caching database connections in development
  // prevents memory leaks from unclosed connections
  client = remember("dbPool", () => createPool());
}

export const db = drizzle({ client, schema });
export default db;
