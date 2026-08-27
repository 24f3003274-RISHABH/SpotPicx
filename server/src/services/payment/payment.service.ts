import {
  IPaymentGateway,
  CreateCheckoutParams,
  CheckoutSessionResult,
  VerifyPaymentParams,
  PaymentVerificationResult,
  WebhookEventResult,
} from './payment.interface';
import { RazorpayPaymentProvider } from './razorpay.provider';
import { StripePaymentProvider } from './stripe.provider';
import { MockPaymentProvider } from './mock.provider';

export class PaymentService {
  private static providers: Map<string, IPaymentGateway> = new Map();

  static {
    this.registerProvider(new RazorpayPaymentProvider());
    this.registerProvider(new StripePaymentProvider());
    this.registerProvider(new MockPaymentProvider());
  }

  public static registerProvider(provider: IPaymentGateway) {
    this.providers.set(provider.providerName, provider);
  }

  public static getProvider(name?: 'RAZORPAY' | 'STRIPE' | 'MOCK'): IPaymentGateway {
    if (name && this.providers.has(name)) {
      const selected = this.providers.get(name)!;
      if (selected.isConfigured() || name === 'MOCK') {
        return selected;
      }
    }

    // Auto-detect best configured provider
    const razorpay = this.providers.get('RAZORPAY');
    if (razorpay && razorpay.isConfigured()) return razorpay;

    const stripe = this.providers.get('STRIPE');
    if (stripe && stripe.isConfigured()) return stripe;

    // Fallback to Mock provider for zero-configuration simulation
    return this.providers.get('MOCK')!;
  }

  public static async createCheckoutSession(
    params: CreateCheckoutParams,
    preferredProvider?: 'RAZORPAY' | 'STRIPE' | 'MOCK'
  ): Promise<CheckoutSessionResult> {
    const provider = this.getProvider(preferredProvider);
    return provider.createCheckoutSession(params);
  }

  public static async verifyPayment(
    params: VerifyPaymentParams
  ): Promise<PaymentVerificationResult> {
    const provider = this.getProvider(params.provider);
    return provider.verifyPayment(params);
  }

  public static async cancelSubscription(
    subscriptionId: string,
    providerName?: 'RAZORPAY' | 'STRIPE' | 'MOCK'
  ): Promise<boolean> {
    const provider = this.getProvider(providerName);
    return provider.cancelSubscription(subscriptionId);
  }

  public static async handleWebhook(
    providerName: 'RAZORPAY' | 'STRIPE' | 'MOCK',
    payload: any,
    signature: string
  ): Promise<WebhookEventResult> {
    const provider = this.getProvider(providerName);
    return provider.handleWebhook(payload, signature);
  }
}
