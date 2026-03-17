import { defineConfig } from "@prisma/config";
import { config } from "dotenv";
import path from "node:path";

// Load the .env file that is right next to this config file
// the env and prisma config is located in the server directory
config({ path: path.resolve(__dirname, ".env") });

export default defineConfig({
  // Point down into the prisma folder to find the actual schema
  schema: "./prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL as string,
  },
});