import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Card } from '../../common/entities/card.entity';

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

    create(card: Card): Promise<Card> {
        return this.cardsRepository.save(card);
    }

    async update(id: string, card: Partial<Card>): Promise<Card> {
        await this.cardsRepository.update(id, card);
        return this.cardsRepository.findOneBy({ id });
    }

    async remove(id: string): Promise<void> {
        await this.cardsRepository.delete(id);
    }
}
