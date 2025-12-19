import { Injectable } from '@nestjs/common';
import { ProductRepository } from './product.repository';
import { GetListProductsRequestDto } from './dto/get-list-products.request';
import { GetListProductsResponseDto } from './dto/get-list-products.response';
import { Prisma } from 'generated/prisma/client';

@Injectable()
export class ProductService {
  constructor(private readonly repository: ProductRepository) {}

  async getListProducts(
    query?: GetListProductsRequestDto,
  ): Promise<GetListProductsResponseDto> {
    const page = query?.page || 1;
    const limit = query?.limit || 10;
    const search = query?.search;

    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { sku: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {};

    const [products, total] = await this.repository.findAll({
      skip,
      take: limit,
      where,
      orderBy: { id: 'desc' }, // Optional: User didn't specify order, but consistent order is good
    });

    return {
      data: products.map((p) => ({
        id: p.id,
        name: p.name,
        sku: p.sku,
      })),
      total,
      page,
      limit,
    };
  }
}
