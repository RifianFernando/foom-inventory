import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GetStocksDto } from './dto/get-stocks.dto';
import { StockWhereInput } from 'generated/prisma/models';
import { Prisma } from 'generated/prisma/client';

@Injectable()
export class StockRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(params: GetStocksDto): Promise<{
    stocks: Prisma.StockGetPayload<{
      include: {
        product: true;
        warehouse: true;
      };
    }>[];
    total: number;
  }> {
    const { page = 1, limit = 10, search } = params;
    const skip = (page - 1) * limit;

    const where: StockWhereInput = {};

    if (search) {
      where.OR = [
        { product: { name: { contains: search, mode: 'insensitive' } } },
        { warehouse: { name: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const [stocks, total] = await Promise.all([
      this.prisma.stock.findMany({
        skip,
        take: limit,
        where,
        include: {
          product: true,
          warehouse: true,
        },
        orderBy: {
          product: {
            name: 'asc',
          },
        },
      }),
      this.prisma.stock.count({ where }),
    ]);

    return { stocks, total };
  }
}
