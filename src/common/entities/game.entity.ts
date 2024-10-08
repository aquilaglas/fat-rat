import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
} from 'typeorm';
import {Card} from "./card.entity";
import {Player} from "./player.entity";

@Entity()
export class Game {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    players: Player[];

    @Column({default: []})
    servePile: Card[];

    @Column({default: []})
    discardPile: Card[];

    @Column({default: false})
    isRunning: boolean;

    @Column({default: 25})
    maxScore: number;

    @Column({nullable: true})
    fatRat: number;
}
