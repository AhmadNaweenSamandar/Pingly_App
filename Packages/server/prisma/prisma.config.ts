// packages/server/prisma.config.ts
import { defineConfig } from "@prisma/config";
import { config } from "dotenv";
import path from "node:path";

// 1. Manually load the .env file from the current directory
config({ path: path.join(process.cwd(), ".env") });

export default defineConfig({
  schema: "./prisma/schema.prisma",
  datasource: {
    // 2. Use process.env directly instead of the env() helper
    // This is often more reliable in monorepos
    url: process.env.DATABASE_URL,
  },
});