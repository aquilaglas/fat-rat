import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { CardsService } from './cards.service';
import { Card } from '../../common/entities/card.entity';

@Controller('cards')
export class CardsController {
    constructor(private readonly cardsService: CardsService) {}

    @Get()
    findAll() {
        return this.cardsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.cardsService.findOne(id);
    }

    @Post()
    create() {
        return this.cardsService.createAll();
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() card: Partial<Card>) {
        return this.cardsService.update(id, card);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.cardsService.remove(id);
    }

    @Delete(':id')
    removeAll() {
        return this.cardsService.removeAll();
    }
}
