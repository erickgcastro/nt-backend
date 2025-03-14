import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  Request,
  ForbiddenException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { InvoicesService } from '../services/invoices.service';
import { InvoiceResponseDto } from '../dto/invoice-response.dto';

@ApiTags('invoices')
@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a specific invoice' })
  @ApiResponse({
    status: 200,
    description: 'Invoice retrieved successfully',
    type: InvoiceResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Invoice not found' })
  async findOne(@Param('id') id: string, @Request() req): Promise<InvoiceResponseDto> {
    return this.invoicesService.findOne(id, req.user.id);
  }

  @Get('user/:userId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all invoices for a user' })
  @ApiResponse({
    status: 200,
    description: 'Invoices retrieved successfully',
    type: [InvoiceResponseDto],
  })
  async findByUser(@Param('userId') userId: string, @Request() req): Promise<InvoiceResponseDto[]> {
    if (userId !== req.user.id) {
      throw new ForbiddenException('You can only access your own invoices');
    }

    return this.invoicesService.findByUser(userId);
  }

  @Post('send/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Send an invoice to user email' })
  @ApiResponse({ status: 200, description: 'Invoice sent successfully' })
  @ApiResponse({ status: 404, description: 'Invoice not found' })
  async sendInvoice(@Param('id') id: string, @Request() req): Promise<{ sent: boolean }> {
    await this.invoicesService.sendInvoice(id, req.user.id);
    return { sent: true };
  }
}
