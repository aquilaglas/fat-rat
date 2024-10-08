import { Module } from '@nestjs/common';
import {CardsController} from "./cards.controller";
import {CardsService} from "./cards.service";
import {Card} from "../common/entities/card.entity";
import {TypeOrmModule} from "@nestjs/typeorm";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Card
        ]),
    ],
    controllers: [CardsController],
    providers: [CardsService]
})
export class CardsModule {}
