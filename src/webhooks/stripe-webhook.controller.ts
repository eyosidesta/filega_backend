import { Controller, Post, Req, Headers as NestHeaders } from "@nestjs/common";
import Stripe from "stripe";
import { BusinessesService } from "../businesses/businesses.service";

@Controller('webhooks')
export class StripeWebhookController {
    private stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

    constructor(private readonly businessesService: BusinessesService) {}

    @Post('stripe')
    async handleStripeWebhook(
        @Req() req: any,
        @NestHeaders('stripe-signature') signature: string,
    )
    {
        let event: Stripe.Event;

        try {
            event = this.stripe.webhooks.constructEvent(
                req.body, 
                signature, process.env.STRIPE_WEBHOOK_SECRET!,
            );
        } catch (error) {
            console.error('Stripe signature verification failed:', error.message);
            throw error;
        }

        if (event.type === 'checkout.session.completed') {
            const session = event.data.object as Stripe.Checkout.Session;
            const businessId = session.metadata?.businessId;
            if (businessId) {
                const paidAt = new Date();
                const renewalDueAt = new Date(paidAt);
                renewalDueAt.setFullYear(renewalDueAt.getFullYear() + 1);
                await this.businessesService.update(businessId, {
                    payment_status: 'active',
                    payment_method: 'stripe',
                    status: 'active',
                    stripeCheckoutSessionId: session.id,
                    stripePaymentIntentId: session.payment_intent?.toString(),
                    paidAmountCents: session.amount_total ?? undefined,
                    currency: session.currency ?? undefined,
                    paidAt,
                    renewalDueAt,
                });
            }
        }

        if (event.type === 'payment_intent.payment_failed') {
            const pi = event.data.object as Stripe.PaymentIntent;
            const businessId = (pi.metadata as any)?.businessId;
            if (businessId) {
                await this.businessesService.update(businessId, {
                    payment_status: 'rejected',
                });
            }
        }

        return { received: true };
    }
}