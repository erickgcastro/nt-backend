export class Payment {
  id: string;
  userId: string;
  stripePaymentIntentId: string;
  amount: number;
  status: string;
  description?: string;
  subscriptionId?: string;
  createdAt: Date;
  updatedAt: Date;
}
