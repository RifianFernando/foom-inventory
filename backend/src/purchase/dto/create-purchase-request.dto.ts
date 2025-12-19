import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

export class CreatePurchaseRequestItemDto {
  @ApiProperty({ description: 'Product ID' })
  @IsInt()
  @Min(1)
  productId: number;

  @ApiProperty({ description: 'Quantity', minimum: 1 })
  @IsInt()
  @Min(1)
  quantity: number;
}

export class CreatePurchaseRequestDto {
  @ApiProperty({ description: 'Unique Reference ID' })
  @IsString()
  @IsNotEmpty()
  reference: string;

  @ApiProperty({ description: 'Warehouse ID' })
  @IsInt()
  @Min(1)
  warehouseId: number;

  @ApiProperty({
    description: 'List of items',
    type: [CreatePurchaseRequestItemDto],
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreatePurchaseRequestItemDto)
  items: CreatePurchaseRequestItemDto[];
}
