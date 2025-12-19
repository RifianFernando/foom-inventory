
import { ApiProperty } from '@nestjs/swagger';

export class ProductItem {
  @ApiProperty({ description: 'Product ID' })
  id: number;

  @ApiProperty({ description: 'Product Name' })
  name: string;

  @ApiProperty({ description: 'Product SKU' })
  sku: string;
}

export class GetListProductsResponseDto {
  @ApiProperty({ type: [ProductItem], description: 'List of products' })
  data: ProductItem[];

  @ApiProperty({ description: 'Total number of products' })
  total: number;

  @ApiProperty({ description: 'Current page number' })
  page: number;

  @ApiProperty({ description: 'Number of items per page' })
  limit: number;
}
