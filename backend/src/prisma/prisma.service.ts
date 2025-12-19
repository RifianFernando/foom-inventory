import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
// https://www.youtube.com/watch?v=ruC2epbZgEM for prisma 7 only
import { Pool } from 'pg';

export class PrismaService extends PrismaClient {
  constructor() {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error('DATABASE_URL environment variable is not defined');
    }
    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    super({ adapter });
  }
}
