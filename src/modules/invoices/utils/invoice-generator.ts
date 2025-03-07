import * as PDFDocument from 'pdfkit';
import type { Invoice } from '../entities/invoice.entity';

export async function generateInvoicePdf(invoice: Invoice): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });

      const chunks: Buffer[] = [];
      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));

      doc.fontSize(20).text('INVOICE', { align: 'center' });
      doc.moveDown();

      doc.fontSize(12);
      doc.text(`Invoice Number: ${invoice.invoiceNumber}`);
      doc.text(`Date Issued: ${invoice.issuedAt.toLocaleDateString()}`);
      doc.text(`Due Date: ${invoice.dueDate.toLocaleDateString()}`);
      doc.text(`Status: ${invoice.status.toUpperCase()}`);
      doc.moveDown();

      doc.fontSize(14);
      doc.text(`Amount Due: €${invoice.amount.toFixed(2)}`, { align: 'right' });
      doc.moveDown();

      doc.fontSize(12);
      doc.text('Payment Instructions:', { underline: true });
      doc.text('Please transfer the amount to the following bank account:');
      doc.text('Bank: International Bank of Europe');
      doc.text('IBAN: EU00 1234 5678 9012 3456 78');
      doc.text('BIC/SWIFT: INTBKEU');
      doc.text('Reference: ' + invoice.invoiceNumber);

      doc.fontSize(10);
      doc.text('Thank you for your business!');

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}
