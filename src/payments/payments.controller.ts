import { BadRequestException, Body, Controller, Post } from "@nestjs/common";
import { PaymentsService } from "./payments.service";
import { BusinessesService } from "src/businesses/businesses.service";

@Controller('payments')
export class PaymentsController {
    constructor(
        private readonly paymentsService: PaymentsService,
        private readonly businessesService: BusinessesService
    ) {}

    @Post('checkout-session')
    async createCheckoutSession(@Body() body: { businessId: string, plan: 'BASIC' | 'PREMIUM' }) {
        const { businessId, plan } = body;

        const business = await this.businessesService.findOne(businessId);
        if (!business || business.payment_status !== 'pending_payment') {
            throw new BadRequestException('Invalid business');
        }

        const session = await this.paymentsService.createCheckoutSession(business, plan);

        await this.businessesService.update(businessId, {
            stripeCheckoutSessionId: session.id,
            payment_method: 'stripe',
        });

        return {
            url: session.url,
        };
        
    }
}