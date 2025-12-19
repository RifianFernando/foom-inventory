import { ApiProperty } from '@nestjs/swagger';

export class StockItem {
  @ApiProperty({ description: 'Warehouse ID' })
  warehouseId: number;

  @ApiProperty({ description: 'Product ID' })
  productId: number;

  @ApiProperty({ description: 'Quantity' })
  quantity: number;

  @ApiProperty({ description: 'Product Name' })
  productName: string;

  @ApiProperty({ description: 'Product SKU' })
  productSku: string;

  @ApiProperty({ description: 'Warehouse Name' })
  warehouseName: string;
}

export class GetStocksResponseDto {
  @ApiProperty({ type: [StockItem], description: 'List of stocks' })
  data: StockItem[];

  @ApiProperty({ description: 'Total number of records' })
  total: number;

  @ApiProperty({ description: 'Current page number' })
  page: number;

  @ApiProperty({ description: 'Number of items per page' })
  limit: number;
}
