import { Module } from '@nestjs/common';
import { StockController } from './stock.controller';
import { StockService } from './stock.service';
import { StockRepository } from './stock.repository';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [StockController],
  providers: [StockService, StockRepository, PrismaService]
})
export class StockModule {}
