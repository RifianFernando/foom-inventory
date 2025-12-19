import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsOptional,
  IsString,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreatePurchaseRequestItemDto } from './create-purchase-request.dto';

export enum PurchaseRequestStatus {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
}

export class UpdatePurchaseRequestDto {
  @ApiPropertyOptional({ enum: PurchaseRequestStatus })
  @IsOptional()
  @IsEnum(PurchaseRequestStatus)
  status?: PurchaseRequestStatus;

  @ApiPropertyOptional({ description: 'Unique Reference ID' })
  @IsOptional()
  @IsString()
  reference?: string;

  @ApiPropertyOptional({
    description: 'List of items to replace existing items',
    type: [CreatePurchaseRequestItemDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePurchaseRequestItemDto)
  items?: CreatePurchaseRequestItemDto[];
}
