import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";


@Entity()
export class Event{

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    name: string;

    @Column()
    address: string;

    @Column()
    start: Date;

    @Column()
    end: Date;

    @ManyToOne(() => User, user => user.events)
    user: User;

}