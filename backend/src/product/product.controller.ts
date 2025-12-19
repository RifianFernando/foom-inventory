import {
  Controller,
  Get,
  Query,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ProductService } from './product.service';
import { GetListProductsRequestDto } from './dto/get-list-products.request';
import { GetListProductsResponseDto } from './dto/get-list-products.response';

@Controller('products')
@ApiTags('Products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @ApiOkResponse({
    description: 'List of products',
    type: GetListProductsResponseDto,
  })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async getListProducts(
    @Query() query: GetListProductsRequestDto,
  ): Promise<GetListProductsResponseDto> {
    return this.productService.getListProducts(query);
  }
}
