import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";
import { Event } from "./Event";
import * as bcrypt from "bcryptjs"
import { Length } from "class-validator";

@Entity()
@Unique(["email"])
export class User{

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    email: string;

    @Column()
    @Length(8,20)
    password: string;

    @Column()
    @Length(1,128)
    firstname: string;

    @Column()
    @Length(1,128)
    lastname: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn({  select: false })
    updateAt: Date;

    @OneToMany(() => Event, event => event.user)
    events: Event[];

    hashPassword(){
        this.password = bcrypt.hashSync(this.password, 8);
    }

    isUnencryptedPasswordValid(unencryptedPassword: string){
        return bcrypt.compareSync(unencryptedPassword, this.password);
    }

}