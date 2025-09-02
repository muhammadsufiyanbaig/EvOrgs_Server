"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const drizzle_kit_1 = require("drizzle-kit");
(0, dotenv_1.config)({ path: '.env' });
exports.default = (0, drizzle_kit_1.defineConfig)({
    schema: "./src/Schema",
    out: "./migrations",
    dialect: "postgresql",
    dbCredentials: {
        url: process.env.DATABASE_URL || "postgresql://neondb_owner:Lkyz7Sbu0tCj@ep-summer-snowflake-a1epoigq-pooler.ap-southeast-1.aws.neon.tech/EvOrgsDevelopment?sslmode=require",
    },
});
