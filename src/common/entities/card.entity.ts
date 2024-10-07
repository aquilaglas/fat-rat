import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
} from 'typeorm';
import {CardTypesEnum} from "../enums/card-types.enum";
import {CardSymbolsEnum} from "../enums/card-symbols.enum";

@Entity()
export class Card {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    symbol: CardSymbolsEnum;

    @Column()
    type: CardTypesEnum;

    @Column({ default: true })
    isActive: boolean;
}
