import { Injectable } from '@nestjs/common';
import { createTransport } from 'nodemailer';
import * as fs from 'fs';
import * as path from 'path';
import * as Handlebars from 'handlebars';

@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    this.transporter = createTransport({
      host: process.env.EMAIL_HOST,
      port: Number.parseInt(process.env.EMAIL_PORT, 10),
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async sendInvoiceEmail(to: string, subject: string, invoiceData): Promise<void> {
    try {
      const templatePath = path.resolve(__dirname, '../../../templates/invoice-email.hbs');
      const templateSource = fs.readFileSync(templatePath, 'utf8');
      const template = Handlebars.compile(templateSource);

      const html = template(invoiceData);

      await this.transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to,
        subject,
        html,
        attachments: [
          {
            filename: `invoice-${invoiceData.invoiceNumber}.pdf`,
            content: invoiceData.pdfBuffer,
            contentType: 'application/pdf',
          },
        ],
      });
    } catch (error) {
      throw new Error(`Failed to send invoice email: ${error.message}`);
    }
  }
}
