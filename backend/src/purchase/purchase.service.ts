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
import { Prisma } from 'generated/prisma/client';

@Injectable()
export class PurchaseService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(params: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<{ data: any[]; total: number; page: number; limit: number }> {
    const { page = 1, limit = 10, search } = params;
    const skip = (page - 1) * limit;

    const where: Prisma.PurchaseRequestWhereInput = {};
    if (search) {
      where.OR = [
        { reference: { contains: search, mode: 'insensitive' } },
        { status: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.purchaseRequest.findMany({
        where,
        skip,
        take: Number(limit),
        include: {
          items: { include: { product: true } },
          warehouse: true,
        },
        orderBy: { id: 'desc' },
      }),
      this.prisma.purchaseRequest.count({ where }),
    ]);

    return {
      data: data.map((pr) => ({
        id: pr.id,
        reference: pr.reference,
        warehouse: pr.warehouse.name,
        warehouseId: pr.warehouseId,
        status: pr.status,
        qty_total: pr.items.reduce((sum, item) => sum + item.quantity, 0),
        request_date: '2025-11-18', // Placeholder as schema doesn't have created_at, or I should check schema
        items: pr.items.map((item) => ({
          productId: item.productId,
          productName: item.product.name,
          quantity: item.quantity,
        })),
      })),
      total,
      page: Number(page),
      limit: Number(limit),
    };
  }

  async findOne(id: number) {
    const pr = await this.prisma.purchaseRequest.findUnique({
      where: { id },
      include: {
        items: { include: { product: true } },
        warehouse: true,
      },
    });

    if (!pr) {
      throw new NotFoundException(`Purchase Request with ID ${id} not found`);
    }

    return {
      id: pr.id,
      reference: pr.reference,
      warehouseId: pr.warehouseId,
      status: pr.status,
      items: pr.items.map((item) => ({
        id: item.id,
        productId: item.productId,
        productName: item.product.name,
        quantity: item.quantity,
      })),
    };
  }

  async findAllWarehouses() {
    return await this.prisma.warehouse.findMany();
  }


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
    // Fetch the existing purchase request
    const pr = await this.prisma.purchaseRequest.findUnique({
      where: { id },
      include: { items: { include: { product: true } } },
    });

    if (!pr) {
      throw new NotFoundException(`Purchase Request with ID ${id} not found`);
    }

    // Only allow updates when status is DRAFT
    if (pr.status !== 'DRAFT') {
      throw new BadRequestException(
        'Purchase Request can only be updated when status is DRAFT',
      );
    }

    // If changing to PENDING, ensure items will exist
    if (dto.status === PurchaseRequestStatus.PENDING) {
      // Check if items will exist after the update
      const willHaveItems =
        dto.items && dto.items.length > 0 ? true : pr.items.length > 0;

      if (!willHaveItems) {
        throw new BadRequestException(
          'Cannot change status to PENDING: No items found. Please add items first.',
        );
      }
    }

    // Step 1: If status is changing to PENDING, prepare and validate external API call first
    if (dto.status === PurchaseRequestStatus.PENDING) {
      try {
        // First, update items if provided (without changing status yet)
        let itemsForApi: Array<{
          product_name: string;
          sku_barcode: string;
          qty: number;
        }>;

        if (dto.items && dto.items.length > 0) {
          // Validate products exist
          const productIds = dto.items.map((i) => i.productId);
          const products = await this.prisma.product.findMany({
            where: { id: { in: productIds } },
          });

          if (products.length !== productIds.length) {
            const foundIds = products.map((p) => p.id);
            const missingIds = productIds.filter(
              (id) => !foundIds.includes(id),
            );
            throw new BadRequestException(
              `Products with IDs ${missingIds.join(', ')} not found`,
            );
          }

          const productMap = new Map(products.map((p) => [p.id, p]));
          itemsForApi = dto.items.map((item) => ({
            product_name: productMap.get(item.productId)!.name,
            sku_barcode: productMap.get(item.productId)!.sku,
            qty: item.quantity,
          }));
        } else {
          // Use existing items
          itemsForApi = pr.items.map((item) => ({
            product_name: item.product.name,
            sku_barcode: item.product.sku,
            qty: item.quantity,
          }));
        }

        const payload = {
          vendor: 'PT FOOM LAB GLOBAL',
          reference: dto.reference || pr.reference,
          qty_total: itemsForApi.reduce((sum, item) => sum + item.qty, 0),
          details: itemsForApi,
        };

        console.log('Sending request to external API:', payload);

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

        console.log('Response status:', response.status);

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `External API returned ${response.status}: ${errorText}`,
          );
        }

        type responseType = {
          API_ID: string;
          status: string;
          message: string;
        };

        const responseData = (await response.json()) as responseType;
        console.log('External API response:', responseData);
      } catch (error) {
        // If external API fails, throw error and don't update status
        throw new InternalServerErrorException(
          `Failed to trigger purchase flow: ${error.message}`,
        );
      }
    }

    // Step 2: Now update the database (items, reference, and status)
    // This only happens if external API succeeded (or status is not changing to PENDING)
    const updatedPr = await this.prisma.$transaction(async (tx) => {
      // If items are provided, replace them
      if (dto.items && dto.items.length > 0) {
        // Validate that all products exist before updating
        const productIds = dto.items.map((i) => i.productId);
        const products = await tx.product.findMany({
          where: { id: { in: productIds } },
        });

        if (products.length !== productIds.length) {
          const foundIds = products.map((p) => p.id);
          const missingIds = productIds.filter((id) => !foundIds.includes(id));
          throw new BadRequestException(
            `Products with IDs ${missingIds.join(', ')} not found`,
          );
        }

        // Delete existing items and create new ones
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

      // Update the purchase request (reference and/or status)
      const updated = await tx.purchaseRequest.update({
        where: { id },
        data: {
          status: dto.status,
          reference: dto.reference,
        },
        include: {
          items: { include: { product: true } },
        },
      });

      return updated;
    });

    // Return the updated purchase request
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
  }

  async delete(id: number): Promise<void> {
    const pr = await this.prisma.purchaseRequest.findUnique({
      where: { id },
    });

    if (!pr) {
      throw new NotFoundException(`Purchase Request with ID ${id} not found`);
    }

    if (pr.status !== 'DRAFT') {
      throw new BadRequestException(
        'Purchase Request can only be deleted when status is DRAFT',
      );
    }

    await this.prisma.$transaction([
      this.prisma.purchaseRequestItem.deleteMany({
        where: { purchaseRequestId: id },
      }),
      this.prisma.purchaseRequest.delete({
        where: { id },
      }),
    ]);
  }
}
