import { db } from "./connection.js";
import {} from "./schema.js";

const seed = async () => {
  console.log("🌱 Starting database seed...");

  try {
    // Step 1: Clear existing data (order matters!)
    console.log("Clearing existing data...");

    // Step 2: Create foundation data
    console.log("Creating demo table...");

    console.log("✅ Database seeded successfully!");
  } catch (e) {
    console.error("❌ Seed failed:", e);

    // throw e;
    process.exit(1);
  }
};

// Run seed if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seed()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export default seed;
