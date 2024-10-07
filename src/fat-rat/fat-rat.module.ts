import { Module } from '@nestjs/common';
import {FatRatService} from "./fat-rat.service";
import {FatRatController} from "./fat-rat.controller";

@Module({
    controllers: [FatRatController],
    providers: [FatRatService]
})
export class FatRatModule {}
