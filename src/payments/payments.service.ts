import { Injectable } from '@nestjs/common';
import { Business } from 'src/businesses/entities/business.entity';
import Stripe from 'stripe';

@Injectable()
export class PaymentsService {
    private stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

    getAmountForPlan(plan: 'BASIC' | 'PREMIUM'): number {
        if (plan === 'BASIC')  return 30000;
        if (plan === 'PREMIUM') return 50000;
        throw new Error('Invalid plan');
    }

    async createCheckoutSession(business: Business, plan: 'BASIC' | 'PREMIUM') {
        const amount = this.getAmountForPlan(plan);
        const currency = business.country === 'US' ? 'usd' : 'cad';
        return this.stripe.checkout.sessions.create({
            mode: 'payment',
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency,
                        product_data: {
                            name: `Subscription to ${plan} Filega plan`,
                        },
                        unit_amount: amount,
                    },
                    quantity: 1,
                },
            ],
            metadata: {
                businessId: business.id,
                plan,
                type: 'subscription',
            },
            success_url: `${process.env.FRONTEND_URL}/payment/success?businessId=${business.id}`,
            cancel_url: `${process.env.FRONTEND_URL}/payment/cancel?businessId=${business.id}`,
        });
    }
}