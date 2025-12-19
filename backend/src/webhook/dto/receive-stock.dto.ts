import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsObject,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

export class StockItemDetailDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  sku_barcode: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  product_name: string;

  @ApiProperty()
  @IsInt()
  @Min(1)
  qty: number;
}

export class ReceiveStockDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  request_id: string;

  @ApiProperty()
  @IsString()
  send_date: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  reference: string;

  @ApiProperty()
  @IsInt()
  qty_total: number;

  @ApiProperty()
  @IsString()
  status_request: string;

  @ApiProperty({ type: [StockItemDetailDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StockItemDetailDto)
  details: StockItemDetailDto[];
}
