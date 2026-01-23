import { Module } from "@nestjs/common";
import { BusinessesModule } from "src/businesses/businesses.module";
import { StripeWebhookController } from "./stripe-webhook.controller";

@Module({
    imports: [BusinessesModule],
    controllers: [StripeWebhookController],
})
export class WebhooksModule {}