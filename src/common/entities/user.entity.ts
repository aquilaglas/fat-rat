import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
} from 'typeorm';
import {UserRoleEnum} from "../enums/user-role.enum";

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({length: 50})
    name: string;

    @Column({unique: true})
    email: string;

    @Column()
    password: string;

    @Column({nullable: true})
    salt: string;

    @Column({nullable: true})
    age: number;

    @Column({nullable: true, length: 50})
    username: string;

    @Column({nullable: true})
    role: UserRoleEnum;

    @Column({nullable: true})
    bestScore: number;
}
