import { sql } from "drizzle-orm";
import { db } from "../../src/db/connection.ts";
import {} from "../../src/db/schema.ts";

export async function connect() {
  return await db.execute(sql`SELECT current_database()`);
}
