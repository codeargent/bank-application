import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Account } from '../../accounts/entity/account.entity';
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'users' })
@ObjectType()
export class User {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column({ unique: true })
  @Field()
  email: string;

  @Column()
  @Field()
  password: string;

  @OneToOne(() => Account, account => account.user)
  @JoinColumn()
  @Field(() => Account, { nullable: true })
  account?: Account;
}
