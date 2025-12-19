import { Injectable } from '@nestjs/common';
import { StockRepository } from './stock.repository';
import { GetStocksDto } from './dto/get-stocks.dto';
import { GetStocksResponseDto } from './dto/get-stocks-response.dto';

@Injectable()
export class StockService {
  constructor(private readonly stockRepository: StockRepository) {}

  async getStocks(params: GetStocksDto): Promise<GetStocksResponseDto> {
    const [stocks, total] = await this.stockRepository.findAll(params);

    const data = stocks.map((stock) => ({
      warehouseId: stock.warehouseId,
      productId: stock.productId,
      quantity: stock.quantity,
      productName: (stock as any).product?.name,
      productSku: (stock as any).product?.sku,
      warehouseName: (stock as any).warehouse?.name,
    }));

    return {
      data,
      total,
      page: params.page || 1,
      limit: params.limit || 10,
    };
  }
}
