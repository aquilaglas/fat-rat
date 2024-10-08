import {
    Column,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import {User} from "./user.entity";
import {Card} from "./card.entity";


@Entity()
export class Player {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({default: 0})
    score: number;

    @Column({default: []})
    cards: Card[];

    @OneToOne(() => User, (user) => user.player)
    @JoinColumn()
    user: User;
}
