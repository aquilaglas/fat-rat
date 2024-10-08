import {Controller, Get, Post, Body, Param, Delete, Put, Logger} from '@nestjs/common';
import { CardsService } from './cards.service';
import { Card } from '../common/entities/card.entity';

@Controller('cards')
export class CardsController {
    private logger: Logger = new Logger(CardsController.name);

    constructor(private readonly cardsService: CardsService) {}

    @Get()
    findAll() {
        this.logger.log('Received GET request on cards');
        return this.cardsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        this.logger.log('Received GET request on cards/' + id);
        return this.cardsService.findOne(id);
    }

    @Post()
    create() {
        this.logger.log('Received POST request on cards');
        return this.cardsService.createAll();
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() card: Partial<Card>) {
        this.logger.log('Received PUT request on cards/' + id);
        return this.cardsService.update(id, card);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        this.logger.log('Received DELETE request on cards/' + id);
        return this.cardsService.remove(id);
    }

    @Delete()
    removeAll() {
        this.logger.log('Received DELETE request on cards');
        return this.cardsService.removeAll();
    }
}
