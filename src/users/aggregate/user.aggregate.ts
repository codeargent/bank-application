import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Account } from 'src/accounts/entity/account.entity';
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

  @OneToOne(() => Account)
  @JoinColumn()
  @Field({ nullable: true })
  account?: Account;
}
