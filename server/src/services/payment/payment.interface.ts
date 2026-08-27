export interface CreateCheckoutParams {
  businessId: string;
  userId: string;
  planId: 'FREE' | 'BASIC' | 'PREMIUM' | 'ENTERPRISE';
  billingCycle: 'MONTHLY' | 'ANNUAL';
  amount: number;
  currency: string;
  customerEmail: string;
  customerName?: string;
  customerPhone?: string;
  successUrl?: string;
  cancelUrl?: string;
  metadata?: Record<string, any>;
}

export interface CheckoutSessionResult {
  provider: 'RAZORPAY' | 'STRIPE' | 'MOCK';
  sessionId: string;
  orderId?: string;
  amount: number;
  currency: string;
  keyId?: string; // For client-side SDK initialization (e.g. Razorpay Key ID or Stripe Publishable Key)
  checkoutUrl?: string;
  clientSecret?: string;
  metadata?: Record<string, any>;
}

export interface VerifyPaymentParams {
  provider: 'RAZORPAY' | 'STRIPE' | 'MOCK';
  orderId?: string;
  paymentId: string;
  signature?: string;
  sessionId?: string;
  businessId: string;
  planId: 'FREE' | 'BASIC' | 'PREMIUM' | 'ENTERPRISE';
  billingCycle: 'MONTHLY' | 'ANNUAL';
  amount: number;
}

export interface PaymentVerificationResult {
  success: boolean;
  transactionId: string;
  amount: number;
  currency: string;
  paidAt: Date;
  receiptNumber?: string;
  rawResponse?: any;
}

export interface WebhookEventResult {
  handled: boolean;
  eventType: string;
  subscriptionId?: string;
  businessId?: string;
  status?: string;
}

export interface IPaymentGateway {
  readonly providerName: 'RAZORPAY' | 'STRIPE' | 'MOCK';
  isConfigured(): boolean;
  createCheckoutSession(params: CreateCheckoutParams): Promise<CheckoutSessionResult>;
  verifyPayment(params: VerifyPaymentParams): Promise<PaymentVerificationResult>;
  cancelSubscription(subscriptionId: string): Promise<boolean>;
  handleWebhook(payload: any, signature: string): Promise<WebhookEventResult>;
}
