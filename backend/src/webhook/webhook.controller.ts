import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { WebhookService } from './webhook.service';
import { ReceiveStockDto } from './dto/receive-stock.dto';

@ApiTags('Webhooks')
@Controller('webhook')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Post('receive-stock')
  @ApiOperation({ summary: 'Receive stock update via webhook' })
  @ApiBody({ type: ReceiveStockDto })
  async receiveStock(@Body() payload: ReceiveStockDto) {
    return await this.webhookService.receiveStock(payload);
  }
}
