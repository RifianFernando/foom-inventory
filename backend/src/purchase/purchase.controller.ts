import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Post,
  Put,
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
}
