import { Length } from "class-validator";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./User";


@Entity()
export class Event{

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    @Length(2,128)
    name: string;

    @Column()
    @Length(2,128)
    address: string;

    @Column()
    start: Date;

    @Column()
    end: Date;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn({  select: false })
    updateAt: Date;

    @ManyToOne(() => User, user => user.events, { onDelete: "CASCADE" })
    user: User;

}