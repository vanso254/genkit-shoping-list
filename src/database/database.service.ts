import { Injectable,OnModuleInit,OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from 'generated/prisma';

@Injectable()
export class DatabaseService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect(); // Connect to the database
  }

  async onModuleDestroy() {
    await this.$disconnect(); // Disconnect from the database
  }
}