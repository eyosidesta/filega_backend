import { Module } from "@nestjs/common";
import { PaymentsService } from "./payments.service";
import { PaymentsController } from "./payments.controller";
import { BusinessesModule } from "src/businesses/businesses.module";

@Module({
    controllers: [PaymentsController],
    providers: [PaymentsService],
    imports: [BusinessesModule],
})

export class PaymentsModule {}