// prisma.config.ts
import { defineConfig } from '@prisma/config';

export default defineConfig({
  schema: './schema.prisma',
  datasource: {
    url: process.env.DATABASE_URL || 'your-default-url-here', // Provide a default if needed
  },
});