// packages/server/prisma/prisma.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
// import { PrismaClient } from '@prisma/client';
// ADD THIS: imported the generated prisma from prisma file it self instead of node_module
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

/* This service extends the generated PrismaClient and hooks into NestJS's lifecycle events. 
This ensures the database connects when the server boots up (avoiding a cold-start delay on your first API request) 
and disconnects gracefully when the server shuts down. */

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);
  private _user: any;
  public get user(): any {
    return this._user;
  }
  public set user(value: any) {
    this._user = value;
  }

  constructor() {
    // 1. Initialize the standard pg connection pool
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    
    // 2. Wrap the pool in Prisma's driver adapter
    const adapter = new PrismaPg(pool as any);

    // we can pass PrismaClientOptions here for logging queries in development
    super({
      adapter,
      log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
    });
  }

  async onModuleInit() {
    this.logger.log('Initializing database connection...');
    await this.$connect();
    this.logger.log('Database connected successfully.');
  }

  async onModuleDestroy() {
    this.logger.log('Closing database connection...');
    await this.$disconnect();
  }
}