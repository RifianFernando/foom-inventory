## 1. nest new foom-inventory (https://docs.nestjs.com/)

## 2. install dependencies that need for our apps

<!-- impolementing auth using passport jwt and local -->

<https://docs.nestjs.com/recipes/passport#implementing-passport-local>
<https://docs.nestjs.com/recipes/passport#implementing-passport-jwt>

<!-- implementing orm and database using prisma -->

<https://docs.nestjs.com/recipes/prisma#set-up-prisma>

<!-- implementing orm and database using prisma -->

```bash
   pnpm i dotenv
```

## 3. setup prisma from the cli documentation

## 4. create .env file in the root directory and add the following environment variables


## 5. update the prisma/schema.prisma file with the following content
Database Models (Schema)
● Warehouse: id, name
● Product: id, name, sku (e.g., Name: "Icy Mint", SKU: "ICYMINT")
● Stock: warehouse_id, product_id, quantity
● PurchaseRequest: id, reference (Unique string, e.g., "PR00001"), warehouse_id, status.
● PurchaseRequestItem: id, purchase_request_id, product_id, quantity


## 6. run the following command to generate the prisma client
```bash
   prisma generate
```

## 7. create modules, services, repository, controllers for each feature
- product
- stock
- purchase
- webhook

using

### module

nest g module product
CREATE src/product/product.module.ts (88 bytes)
UPDATE src/app.module.ts (330 bytes)

nest g module stock
CREATE src/stock/stock.module.ts (86 bytes)
UPDATE src/app.module.ts (395 bytes)

nest g module purchase

CREATE src/purchase/purchase.module.ts (89 bytes)
UPDATE src/app.module.ts (474 bytes)
nest g module webhook

CREATE src/webhook/webhook.module.ts (88 bytes)
UPDATE src/app.module.ts (547 bytes)


### controller
nest g co product
nest g co stock
nest g co purchase
nest g co webhook

### service
nest g s product
nest g s stock
nest g s purchase
nest g s webhook

## 8. create repository manually using class component

## 9. we can continue Implement a REST API for inventory management

