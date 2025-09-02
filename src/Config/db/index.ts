import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";

config({ path: ".env.local" }); // Load .env.local file

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle({ client: sql });

// Export the type of your drizzle instance
export type DrizzleDB = typeof db;