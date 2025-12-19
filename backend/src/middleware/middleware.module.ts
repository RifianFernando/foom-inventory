// src/middleware/middleware.module.ts
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AdvancedLoggerMiddleware } from './logger.middleware';

@Module({})
export class MiddlewareModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AdvancedLoggerMiddleware).forRoutes('*');
  }
}
