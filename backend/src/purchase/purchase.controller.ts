import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Get,
  Delete,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { PurchaseService } from './purchase.service';
import { CreatePurchaseRequestDto } from './dto/create-purchase-request.dto';
import { CreatePurchaseRequestResponseDto } from './dto/create-purchase-request-response.dto';
import { UpdatePurchaseRequestDto } from './dto/update-purchase-request.dto';

@ApiTags('Purchases')
@Controller('purchase')
export class PurchaseController {
  constructor(private readonly purchaseService: PurchaseService) {}

  @Get('warehouses')
  @ApiOperation({ summary: 'List warehouses' })
  @ApiOkResponse({ description: 'List of warehouses' })
  async getListWarehouses() {
    return await this.purchaseService.findAllWarehouses();
  }

  @Get('request')
  @ApiOperation({ summary: 'List purchase requests' })
  @ApiOkResponse({ description: 'List of purchase requests' })
  async getListPurchaseRequests(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('search') search: string,
  ) {
    return await this.purchaseService.findAll({ page, limit, search });
  }

  @Get('request/:id')
  @ApiOperation({ summary: 'Get purchase request details' })
  @ApiOkResponse({ description: 'Purchase request details' })
  @ApiNotFoundResponse({ description: 'Purchase request not found' })
  async getPurchaseRequest(@Param('id', ParseIntPipe) id: number) {
    return await this.purchaseService.findOne(id);
  }

  @Post('request')
  @ApiOperation({ summary: 'Create a new purchase request' })
  @ApiCreatedResponse({
    description: 'Purchase request created successfully',
    type: CreatePurchaseRequestResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async createPurchaseRequest(
    @Body() dto: CreatePurchaseRequestDto,
  ): Promise<CreatePurchaseRequestResponseDto> {
    return await this.purchaseService.create(dto);
  }

  @Put('request/:id')
  @ApiOperation({ summary: 'Update a purchase request' })
  @ApiOkResponse({
    description: 'Purchase request updated successfully',
    type: CreatePurchaseRequestResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Purchase request not found' })
  @ApiBadRequestResponse({ description: 'Invalid input or status not DRAFT' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async updatePurchaseRequest(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePurchaseRequestDto,
  ): Promise<CreatePurchaseRequestResponseDto> {
    return await this.purchaseService.update(id, dto);
  }

  @Delete('request/:id')
  @ApiOperation({ summary: 'Delete a purchase request' })
  @ApiOkResponse({ description: 'Purchase request deleted successfully' })
  @ApiNotFoundResponse({ description: 'Purchase request not found' })
  @ApiBadRequestResponse({
    description: 'Purchase request can only be deleted when DRAFT',
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async deletePurchaseRequest(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    return await this.purchaseService.delete(id);
  }
}
