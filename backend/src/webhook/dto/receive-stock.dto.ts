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
  @IsInt()
  @Min(1)
  qty: number;
}

export class WebhookDataDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  reference: string;

  @ApiProperty({ type: [StockItemDetailDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StockItemDetailDto)
  details: StockItemDetailDto[];
}

export class ReceiveStockDto {
  @ApiProperty()
  @IsObject()
  @ValidateNested()
  @Type(() => WebhookDataDto)
  data: WebhookDataDto;
}
