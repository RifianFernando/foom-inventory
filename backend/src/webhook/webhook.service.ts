import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ReceiveStockDto } from './dto/receive-stock.dto';

@Injectable()
export class WebhookService {
  constructor(private readonly prisma: PrismaService) {}

  async receiveStock(payload: ReceiveStockDto) {
    const { reference, details } = payload;
    console.log('receiveStock payload:', payload);

    // 1. Lookup PurchaseRequest
    const purchaseRequest = await this.prisma.purchaseRequest.findUnique({
      where: { reference },
    });

    if (!purchaseRequest) {
      console.log('purchase request not found for reference:', reference);
      throw new NotFoundException(
        `Purchase Request with reference ${reference} not found`,
      );
    }

    // 3. Check first if purchase request is completed
    if (purchaseRequest.status === 'COMPLETED') {
      console.log('product already completed for reference:', reference);
      return { message: 'Stock already processed', status: 'COMPLETED' };
    }

    console.log('belom ada error, lanjut proses stock update');

    // Process stock update in transaction
    await this.prisma.$transaction(async (tx) => {
      for (const item of details) {
        // Find Product by SKU (sku_barcode)
        const product = await tx.product.findUnique({
          where: { sku: item.sku_barcode },
        });

        if (!product) {
          console.log('product not found for sku:', item.sku_barcode);
          throw new BadRequestException(
            `Product with SKU ${item.sku_barcode} not found`,
          );
        }

        await tx.stock.upsert({
          where: {
            warehouseId_productId: {
              warehouseId: purchaseRequest.warehouseId,
              productId: product.id,
            },
          },
          update: {
            quantity: { increment: item.qty },
          },
          create: {
            warehouseId: purchaseRequest.warehouseId,
            productId: product.id,
            quantity: item.qty,
          },
        });
      }

      // Update PurchaseRequest status
      await tx.purchaseRequest.update({
        where: { id: purchaseRequest.id },
        data: { status: 'COMPLETED' },
      });
    });

    return { message: 'Stock received successfully', status: 'COMPLETED' };
  }
}
