import { Controller, Get, Query } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { StockService } from './stock.service';
import { GetStocksDto } from './dto/get-stocks.dto';
import { GetStocksResponseDto } from './dto/get-stocks-response.dto';

@ApiTags('Stocks')
@Controller('stocks')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Get()
  @ApiOkResponse({
    description: 'List of stock levels',
    type: GetStocksResponseDto,
  })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async getStocks(@Query() query: GetStocksDto): Promise<GetStocksResponseDto> {
    return this.stockService.getStocks(query);
  }
}
