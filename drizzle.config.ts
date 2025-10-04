import { config } from 'dotenv';
import { defineConfig } from "drizzle-kit";

config({ path: '.env.local' });

export default defineConfig({
  schema: "./src/Schema",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL || "postgresql://neondb_owner:Lkyz7Sbu0tCj@ep-summer-snowflake-a1epoigq-pooler.ap-southeast-1.aws.neon.tech/EvOrgsDevelopment?sslmode=require",
  },
});
