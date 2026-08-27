import {
  IPaymentGateway,
  CreateCheckoutParams,
  CheckoutSessionResult,
  VerifyPaymentParams,
  PaymentVerificationResult,
  WebhookEventResult,
} from './payment.interface';

export class MockPaymentProvider implements IPaymentGateway {
  public readonly providerName = 'MOCK' as const;

  public isConfigured(): boolean {
    return true;
  }

  public async createCheckoutSession(params: CreateCheckoutParams): Promise<CheckoutSessionResult> {
    const sessionId = `mock_sess_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const orderId = `mock_order_${Date.now()}`;

    return {
      provider: 'MOCK',
      sessionId,
      orderId,
      amount: params.amount,
      currency: params.currency || 'INR',
      keyId: 'mock_key_test_sandbox',
      checkoutUrl: `/checkout/simulation?session=${sessionId}`,
      metadata: params.metadata,
    };
  }

  public async verifyPayment(params: VerifyPaymentParams): Promise<PaymentVerificationResult> {
    return {
      success: true,
      transactionId: params.paymentId || `mock_pay_${Date.now()}`,
      amount: params.amount,
      currency: 'INR',
      paidAt: new Date(),
      receiptNumber: `RCPT-SP-${Date.now().toString().slice(-6)}`,
      rawResponse: { simulated: true, gateway: 'MOCK_SANDBOX' },
    };
  }

  public async cancelSubscription(_subscriptionId: string): Promise<boolean> {
    return true;
  }

  public async handleWebhook(payload: any, _signature: string): Promise<WebhookEventResult> {
    return {
      handled: true,
      eventType: payload?.event || 'mock.payment.captured',
      subscriptionId: payload?.subscriptionId,
      businessId: payload?.businessId,
      status: 'SUCCESS',
    };
  }
}
