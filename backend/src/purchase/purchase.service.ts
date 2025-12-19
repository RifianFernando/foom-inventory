import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePurchaseRequestDto } from './dto/create-purchase-request.dto';
import { CreatePurchaseRequestResponseDto } from './dto/create-purchase-request-response.dto';
import {
  PurchaseRequestStatus,
  UpdatePurchaseRequestDto,
} from './dto/update-purchase-request.dto';

@Injectable()
export class PurchaseService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    data: CreatePurchaseRequestDto,
  ): Promise<CreatePurchaseRequestResponseDto> {
    const { reference, warehouseId, items } = data;

    // Validate warehouse exists
    const warehouse = await this.prisma.warehouse.findUnique({
      where: { id: warehouseId },
    });

    if (!warehouse) {
      throw new NotFoundException(`Warehouse with ID ${warehouseId} not found`);
    }

    try {
      const result = await this.prisma.$transaction(async (tx) => {
        // Create Purchase Request
        const pr = await tx.purchaseRequest.create({
          data: {
            reference,
            warehouseId,
            status: 'DRAFT',
            items: {
              create: items.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
              })),
            },
          },
          include: {
            items: true,
          },
        });
        return pr;
      });

      return {
        id: result.id,
        reference: result.reference,
        warehouseId: result.warehouseId,
        status: result.status,
        items: result.items.map((item) => ({
          id: item.id,
          productId: item.productId,
          quantity: item.quantity,
        })),
      };
    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException(
          'Product already added to purchase request',
        );
      }
      if (error.code === 'P2003') {
        throw new BadRequestException(
          'Invalid product or warehouse ID referenced',
        );
      }
      throw new InternalServerErrorException(
        'Failed to create purchase request',
      );
    }
  }

  async update(
    id: number,
    dto: UpdatePurchaseRequestDto,
  ): Promise<CreatePurchaseRequestResponseDto> {
    const pr = await this.prisma.purchaseRequest.findUnique({
      where: { id },
      include: { items: { include: { product: true } } },
    });

    if (!pr) {
      throw new NotFoundException(`Purchase Request with ID ${id} not found`);
    }

    if (pr.status !== 'DRAFT') {
      throw new BadRequestException(
        'Purchase Request can only be updated when status is DRAFT',
      );
    }

    // Handle status change to PENDING
    if (dto.status === PurchaseRequestStatus.PENDING) {
      // Trigger external API
      try {
        const payload = {
          vendor: 'PT FOOM LAB GLOBAL', // Hardcoded as per example requirement or assumed context
          reference: dto.reference || pr.reference,
          qty_total:
            dto.items?.reduce((sum, item) => sum + item.quantity, 0) ||
            pr.items.reduce((sum, item) => sum + item.quantity, 0),
          details:
            dto.items?.map((item) => ({
              product_name: 'Unknown',
              // Ideally we fetch this if allowed to update items here. But complex.
              // If we are updating items, we should fetch products.
              // Assuming for PENDING transition, we use current state if items not provided, or new state.
              // Simplified: Using current PR items if items not in DTO.
              sku_barcode: 'Unknown',
              qty: item.quantity,
            })) ||
            pr.items.map((item) => ({
              product_name: item.product.name,
              sku_barcode: item.product.sku,
              qty: item.quantity,
            })),
        };

        // If DTO has items, we need to fetch their details for the payload.
        if (dto.items) {
          const productIds = dto.items.map((i) => i.productId);
          const products = await this.prisma.product.findMany({
            where: { id: { in: productIds } },
          });
          const productMap = new Map(products.map((p) => [p.id, p]));

          payload.details = dto.items.map((item) => {
            const product = productMap.get(item.productId);
            return {
              product_name: product?.name || 'Unknown',
              sku_barcode: product?.sku || 'Unknown',
              qty: item.quantity,
            };
          });
          payload.qty_total = dto.items.reduce((sum, i) => sum + i.quantity, 0);
        }

        const response = await fetch(
          'https://hub.foomid.id/api/request/purchase',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'secret-key': process.env.SECRET_KEY || 'YOUR_SECRET_KEY',
            },
            body: JSON.stringify(payload),
          },
        );

        if (!response.ok) {
          throw new Error(`External API returned ${response.status}`);
        }
      } catch (error) {
        throw new InternalServerErrorException(
          `Failed to trigger purchase flow: ${error.message}`,
        );
      }
    }

    return await this.prisma.$transaction(async (tx) => {
      // If items are provided, replace them
      if (dto.items) {
        await tx.purchaseRequestItem.deleteMany({
          where: { purchaseRequestId: id },
        });
        await tx.purchaseRequestItem.createMany({
          data: dto.items.map((item) => ({
            purchaseRequestId: id,
            productId: item.productId,
            quantity: item.quantity,
          })),
        });
      }

      const updatedPr = await tx.purchaseRequest.update({
        where: { id },
        data: {
          status: dto.status,
          reference: dto.reference,
        },
        include: {
          items: true,
        },
      });

      return {
        id: updatedPr.id,
        reference: updatedPr.reference,
        warehouseId: updatedPr.warehouseId,
        status: updatedPr.status,
        items: updatedPr.items.map((item) => ({
          id: item.id,
          productId: item.productId,
          quantity: item.quantity,
        })),
      };
    });
  }
}
