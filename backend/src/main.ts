import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  BadRequestException,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { createWriteStream, mkdirSync, existsSync } from 'fs';
import { get } from 'http';
import { Request, Response, NextFunction } from 'express';

declare global {
  interface BigInt {
    toJSON(): number | string;
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: (
      origin: string,
      callback: (err: Error | null, allow?: boolean) => void,
    ) => {
      const allowedOrigins = [
        'http://localhost:3000',
        'http://localhost:4000',
        'https://your-production-domain.com',
      ];
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Accept',
      'Authorization',
      'X-Requested-With',
      'access-jwt',
    ],
  });

  // Handle OPTIONS requests manually (Optional)
  // Handle OPTIONS requests manually (Optional)
  app.use((req: Request, res: Response, next: NextFunction) => {
    if (req.method === 'OPTIONS') {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
      res.header(
        'Access-Control-Allow-Headers',
        'Content-Type, Accept, Authorization, X-Requested-With',
      );
      return res.sendStatus(204); // No Content
    }
    next();
  });

  // app.useGlobalFilters(new HttpExceptionFilter()); // Filter excluded as requested/unavailable

  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        return new BadRequestException(
          validationErrors.map((error) => ({
            field: error.property,
            error: Object.values(error.constraints || {}).join(', '),
          })),
        );
      },
      transform: true,
      whitelist: true,
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('SmartMKM API Documentation')
    .setDescription('API Documentation for SmartMKM')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter JWT access token',
        in: 'header',
      },
      'access-jwt',
    )
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter JWT refresh token',
        in: 'header',
      },
      'refresh-jwt',
    )
    .addSecurityRequirements('access-jwt')
    // .addSecurityRequirements('refresh-jwt') // Usually applied selectively, but adding globally if requested
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api-docs', app, document);

  // Enable big int in json serialize
  BigInt.prototype.toJSON = function (this: bigint) {
    const int = Number.parseInt(this.toString());
    return int ?? this.toString();
  };

  const port = process.env.PORT || 4000;
  await app.listen(port);
  const appUrl = await app.getUrl();
  console.log(`Application is running on: ${appUrl}`);

  // get the swagger json file (if app is running in development mode)
  if (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {
    if (!existsSync('swagger-static')) {
      mkdirSync('swagger-static', { recursive: true });
    }

    const baseUrl = `http://localhost:${port}`;

    // write swagger ui files
    get(`${baseUrl}/api-docs/swagger-ui-bundle.js`, function (response) {
      response.pipe(createWriteStream('swagger-static/swagger-ui-bundle.js'));
      console.log(
        `Swagger UI bundle file written to: '/swagger-static/swagger-ui-bundle.js'`,
      );
    });

    get(`${baseUrl}/api-docs/swagger-ui-init.js`, function (response) {
      response.pipe(createWriteStream('swagger-static/swagger-ui-init.js'));
      console.log(
        `Swagger UI init file written to: '/swagger-static/swagger-ui-init.js'`,
      );
    });

    get(
      `${baseUrl}/api-docs/swagger-ui-standalone-preset.js`,
      function (response) {
        response.pipe(
          createWriteStream('swagger-static/swagger-ui-standalone-preset.js'),
        );
        console.log(
          `Swagger UI standalone preset file written to: '/swagger-static/swagger-ui-standalone-preset.js'`,
        );
      },
    );

    get(`${baseUrl}/api-docs/swagger-ui.css`, function (response) {
      response.pipe(createWriteStream('swagger-static/swagger-ui.css'));
      console.log(
        `Swagger UI css file written to: '/swagger-static/swagger-ui.css'`,
      );
    });
  }
}
bootstrap();
