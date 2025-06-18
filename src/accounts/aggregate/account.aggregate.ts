import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'accounts' })
@ObjectType()
export class Account {
  @PrimaryColumn()
  @Field(() => Int)
  userId: number;

  @Column()
  @Field(() => String)
  accountNumber: string;

  @Column({ default: 0 })
  @Field(() => Int)
  balance: number;
}
