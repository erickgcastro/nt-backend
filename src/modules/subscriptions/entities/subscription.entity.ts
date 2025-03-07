export class Subscription {
  id: string;
  userId: string;
  planId: string;
  stripeSubscriptionId: string;
  status: string;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  canceledAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
