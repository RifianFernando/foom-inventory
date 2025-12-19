import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
// https://www.youtube.com/watch?v=ruC2epbZgEM for prisma 7 only
import { Pool } from 'pg';
class prismaService extends PrismaClient {
  constructor() {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error('DATABASE_URL environment variable is not defined');
    }
    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    super({ adapter });
  }
}

const prisma = new prismaService();

async function main() {
  console.log('Start seeding...');

  await prisma.purchaseRequestItem.deleteMany();
  await prisma.stock.deleteMany();
  await prisma.purchaseRequest.deleteMany();
  await prisma.product.deleteMany();
  await prisma.warehouse.deleteMany();

  console.log('Cleared existing data.');

  // 1. Seed Warehouses
  const warehouses: { id: number; name: string }[] = [];
  for (let i = 1; i <= 10; i++) {
    const warehouse = await prisma.warehouse.create({
      data: {
        name: `Warehouse ${String.fromCharCode(64 + i)}`, // Warehouse A, B, C...
      },
    });
    warehouses.push(warehouse);
  }
  console.log(`Created ${warehouses.length} warehouses.`);

  // 2. Seed Products
  const products: { id: number; name: string; sku: string }[] = [];
  for (let i = 1; i <= 10; i++) {
    const product: { id: number; name: string; sku: string } =
      await prisma.product.create({
        data: {
          name: `Product ${i}`,
          sku: `SKU-${1000 + i}`,
        },
      });
    products.push(product);
  }
  console.log(`Created ${products.length} products.`);

  // 3. Seed Stocks
  // Distribute products across warehouses randomly or deterministically
  // We'll fix it so each warehouse has at least 1 product
  let stockCount = 0;
  for (const warehouse of warehouses) {
    // Give each warehouse 5 random products
    // To ensure uniqueness, we shuffle products or just pick a few
    const shuffledProducts = [...products].sort(() => 0.5 - Math.random());
    const selectedProducts = shuffledProducts.slice(0, 5);

    for (const product of selectedProducts) {
      await prisma.stock.create({
        data: {
          warehouseId: warehouse.id,
          productId: product.id,
          quantity: Math.floor(Math.random() * 100) + 1, // 1 to 100
        },
      });
      stockCount++;
    }
  }
  console.log(`Created ${stockCount} stock entries.`);

  // 4. Seed PurchaseRequests
  const purchaseRequests: { id: number }[] = [];
  const statusOptions = ['PENDING', 'APPROVED', 'REJECTED', 'COMPLETED'];

  for (let i = 1; i <= 10; i++) {
    // Pick a random warehouse
    const warehouse = warehouses[Math.floor(Math.random() * warehouses.length)];

    const pr = await prisma.purchaseRequest.create({
      data: {
        reference: `PR-${new Date().getFullYear()}-${1000 + i}`,
        warehouseId: warehouse.id,
        status: statusOptions[Math.floor(Math.random() * statusOptions.length)],
      },
    });
    purchaseRequests.push(pr);
  }
  console.log(`Created ${purchaseRequests.length} purchase requests.`);

  // 5. Seed PurchaseRequestItems
  let prItemCount = 0;
  for (const pr of purchaseRequests) {
    // Add 1-3 items per PR
    const itemCount = Math.floor(Math.random() * 3) + 1;
    const shuffledProducts = [...products].sort(() => 0.5 - Math.random());
    const selectedProducts = shuffledProducts.slice(0, itemCount);

    for (const product of selectedProducts) {
      await prisma.purchaseRequestItem.create({
        data: {
          purchaseRequestId: pr.id,
          productId: product.id,
          quantity: Math.floor(Math.random() * 50) + 1,
        },
      });
      prItemCount++;
    }
  }
  console.log(`Created ${prItemCount} purchase request items.`);

  console.log('Seeding completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
