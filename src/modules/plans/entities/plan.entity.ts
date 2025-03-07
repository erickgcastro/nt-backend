export class Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  billingInterval: string;
  stripePriceId: string;
  stripeProductId: string;
  features: string[];
  createdAt: Date;
  updatedAt: Date;
}
