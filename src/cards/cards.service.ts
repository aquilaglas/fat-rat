import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Card } from '../common/entities/card.entity';
import {cardsData} from "../common/data/cards.data";

@Injectable()
export class CardsService {
    constructor(
        @InjectRepository(Card)
        private cardsRepository: Repository<Card>,
    ) {}

    findAll(): Promise<Card[]> {
        return this.cardsRepository.find();
    }

    findOne(id: string): Promise<Card> {
        return this.cardsRepository.findOneBy({ id });
    }

    async createAll(): Promise<Card[]> {
        let cards: Card[] = [];

        for (const card of cardsData) {
            if (!await this.cardsRepository.findOneBy({symbol: card.symbol, type: card.type})) {
                const newCard: Card = this.cardsRepository.create({
                    ...card,
                });
                cards.push(await this.cardsRepository.save(newCard));
            }
        }
        return this.cardsRepository.save(cards);
    }

    async update(id: string, card: Partial<Card>): Promise<Card> {
        await this.cardsRepository.update(id, card);
        return this.cardsRepository.findOneBy({ id });
    }

    async remove(id: string): Promise<void> {
        await this.cardsRepository.delete(id);
    }

    async removeAll(): Promise<void> {
        for (const card of await this.findAll()) {
            await this.remove(card.id);
        }
    }
}
