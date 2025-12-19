import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductModule } from './product/product.module';
import { StockModule } from './stock/stock.module';
import { WebhookModule } from './webhook/webhook.module';
import { PurchaseModule } from './purchase/purchase.module';
import { PrismaModule } from './prisma/prisma.module';
import { MiddlewareModule } from './middleware/middleware.module';

@Module({
  imports: [
    ProductModule,
    StockModule,
    PurchaseModule,
    WebhookModule,
    PrismaModule,
    MiddlewareModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
