import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Account } from 'src/accounts/aggregate/account.aggregate';
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'users' })
@ObjectType()
export class User {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column()
  @Field()
  email: string;

  @Column()
  @Field()
  password: string;

  @OneToOne(() => Account)
  @JoinColumn()
  @Field({ nullable: true })
  account?: Account;
}
