import { Injectable } from '@nestjs/common';
import { Prisma, Product } from 'generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(params: {
    skip?: number;
    take?: number;
    where?: Prisma.ProductWhereInput;
    orderBy?: Prisma.ProductOrderByWithRelationInput;
  }): Promise<[Product[], number]> {
    const { skip = 0, take = 10, where, orderBy } = params;

    const products = await this.prisma.product.findMany({
      skip,
      take,
      where,
      orderBy,
    });

    const totalCount = await this.prisma.product.count({
      where,
    });

    return [products, totalCount];
  }
}
