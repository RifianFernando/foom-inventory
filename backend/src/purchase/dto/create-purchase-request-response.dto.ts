import { ApiProperty } from '@nestjs/swagger';

export class PurchaseRequestItemResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  productId: number;

  @ApiProperty()
  quantity: number;
}

export class CreatePurchaseRequestResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  reference: string;

  @ApiProperty()
  warehouseId: number;

  @ApiProperty()
  status: string;

  @ApiProperty({ type: [PurchaseRequestItemResponseDto] })
  items: PurchaseRequestItemResponseDto[];
}
