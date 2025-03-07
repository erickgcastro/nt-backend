import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16',
    });
  }

  async createBankTransferPaymentIntent(
    amount: number,
    metadata: Record<string, string>,
  ): Promise<Stripe.PaymentIntent> {
    return this.stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: 'eur',
      payment_method_types: ['sepa_debit', 'bancontact', 'ideal', 'sofort'],
      metadata,
    });
  }

  async getPaymentIntent(paymentIntentId: string): Promise<Stripe.PaymentIntent> {
    return this.stripe.paymentIntents.retrieve(paymentIntentId);
  }

  async createCustomer(email: string, name: string): Promise<Stripe.Customer> {
    return this.stripe.customers.create({
      email,
      name,
    });
  }

  async createSubscription(customerId: string, priceId: string): Promise<Stripe.Subscription> {
    return this.stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
    });
  }

  async cancelSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
    return this.stripe.subscriptions.cancel(subscriptionId);
  }

  async createProduct(name: string, description: string): Promise<Stripe.Product> {
    return this.stripe.products.create({
      name,
      description,
    });
  }

  async createPrice(
    productId: string,
    amount: number,
    interval: 'month' | 'year',
  ): Promise<Stripe.Price> {
    return this.stripe.prices.create({
      product: productId,
      unit_amount: Math.round(amount * 100),
      currency: 'eur',
      recurring: { interval },
    });
  }

  constructEvent(payload: Buffer, signature: string): Stripe.Event {
    return this.stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  }
}
