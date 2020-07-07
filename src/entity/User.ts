/** @format */

import {Entity, PrimaryGeneratedColumn, Column, BaseEntity} from 'typeorm';

@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    avatar: string;

    @Column()
    age: number;

    @Column()
    password: string;

    @Column()
    email: string;
}
