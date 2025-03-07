export class Invoice {
  id: string;
  userId: string;
  paymentId: string;
  subscriptionId: string;
  invoiceNumber: string;
  amount: number;
  status: string;
  issuedAt: Date;
  dueDate: Date;
  paidAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
