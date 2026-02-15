import { env } from "./env.js";
import app from "./server.js";
// import pool from "./db/pool.js";

import { sql } from "drizzle-orm";
import { db } from "./db/connection.js";

app.listen(env.PORT, async () => {
  console.log(`Server running on port ${env.PORT}`);

  try {
    // node-postgres
    //   const resp = await pool.query("SELECT current_database()");
    //   console.log(`database: ${JSON.stringify(resp.rows[0].current_database)}`);

    // drizzle
    const result = await db.execute(sql`SELECT current_database()`);
    console.log("database:", result.rows[0].current_database);
  } catch (err) {
    console.error("Database connection check failed:", err);
  }
});
