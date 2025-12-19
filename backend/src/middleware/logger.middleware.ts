import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AdvancedLoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, ip, headers, body } = req;
    const userAgent = headers['user-agent'] || '';

    // Skip logging for health checks or specific paths
    if (originalUrl === '/health' || originalUrl === '/favicon.ico') {
      return next();
    }

    const start = Date.now();

    // Log request (be careful with sensitive data)
    this.logger.log(
      `→ ${method} ${originalUrl} - IP: ${ip} - Agent: ${userAgent}`,
    );

    // Log response
    res.on('finish', () => {
      const { statusCode } = res;
      const contentLength = res.get('content-length');
      const responseTime = Date.now() - start;

      // Determine log level
      let logLevel: 'log' | 'warn' | 'error' = 'log';
      if (statusCode >= 400 && statusCode < 500) logLevel = 'warn';
      if (statusCode >= 500) logLevel = 'error';

      const message = `← ${method} ${originalUrl} ${statusCode} - ${responseTime}ms - ${contentLength || 0}b`;

      this.logger[logLevel](message);

      // Log additional info for errors
      if (statusCode >= 400) {
        this.logger.debug(`Request Body: ${JSON.stringify(body)}`);
      }
    });

    // Handle response errors
    res.on('error', (error) => {
      this.logger.error(`Response error: ${error.message}`, error.stack);
    });

    next();
  }
}
