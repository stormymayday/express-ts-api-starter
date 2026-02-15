import { config as loadEnv } from "dotenv";
import { z, flattenError } from "zod";

// Determine application stage
process.env.APP_STAGE = process.env.APP_STAGE || "dev";

// Helper Booleans
const isProduction = process.env.APP_STAGE === "production";
const isDevelopment = process.env.APP_STAGE === "dev";
const isTest = process.env.APP_STAGE === "test";

// Load .env files based on environment
if (isDevelopment) {
  loadEnv();
} else if (isTest) {
  loadEnv({ path: ".env.test" });
}

// Define validation schema with Zod
const envSchema = z.object({
  // Node environment
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

  APP_STAGE: z.enum(["dev", "production", "test"]).default("dev"),

  // Server configuration
  PORT: z.coerce.number().positive().default(3000),

  // Database
  DB_HOST: z.string(),
  DB_USER: z.string(),
  DB_PASSWORD: z.string(),
  DB_NAME: z.string(),
  DB_NAME_TEST: z.string().optional(), // only for test env
  DB_PORT: z.coerce.number(),
  DB_URL: z.string().optional(),
  DB_POOL_MIN: z.coerce.number().min(0).default(2),
  DB_POOL_MAX: z.coerce.number().positive().max(20).default(10),
  DB_IDLE_TIMEOUT: z.coerce.number().default(30000),
  DB_CONNECTION_TIMEOUT: z.coerce.number().default(5000),

  // JWT & Authentication
  JWT_SECRET: z
    .string()
    .min(32, "JWT_SECRET must be at least 32 characters long"),
  JWT_EXPIRES_IN: z.string().default("7d"),

  // CORS configuration
  ALLOWED_ORIGINS: z.string().optional().default("*"),

  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(900000),
  RATE_LIMIT_MAX_REQUESTS: z.coerce.number().default(100),

  // Security
  BCRYPT_SALT_ROUNDS: z.coerce.number().min(10).max(20).default(12),

  // Logging
  LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),
});

// Type inference from schema
export type Env = z.infer<typeof envSchema>;

// Environment Validation and Error Handling
// Parse and validate environment variables
let env: Env;

try {
  env = envSchema.parse(process.env);
} catch (error) {
  if (error instanceof z.ZodError) {
    console.error("Invalid environment variables:");
    console.error(JSON.stringify(flattenError(error).fieldErrors, null, 2));

    // Detailed error messages
    error.issues.forEach((err) => {
      const path = err.path.join(".");
      console.error(`  ${path}: ${err.message}`);
    });

    process.exit(1); // Exit with error code
  }

  throw error;
}

// Construct DATABASE_URL from individual components if not provided
if (!env.DB_URL) {
  const encodedPassword = encodeURIComponent(env.DB_PASSWORD);
  env.DB_URL = `postgresql://${env.DB_USER}:${encodedPassword}@${env.DB_HOST}:${env.DB_PORT}/${env.DB_NAME}`;
}

// Helper functions for environment checks
export const isProd = () => env.NODE_ENV === "production";
export const isDev = () => env.NODE_ENV === "development";
export const isTestEnv = () => env.NODE_ENV === "test";

// Export the validated environment
export { env };
export default env;
