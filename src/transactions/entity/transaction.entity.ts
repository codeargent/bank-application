import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Account } from '../../accounts/entity/account.entity';

@Entity({ name: 'transactions' })
@ObjectType()
export class Transaction {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column()
  @Field(() => Int)
  amount: number;

  @Column()
  @Field(() => String)
  type: 'deposit' | 'withdraw';

  @Column()
  @Field(() => Int)
  balance: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @Field(() => String)
  createdAt: Date;

  @Column()
  @Field(() => Int)
  accountId: number;

  @ManyToOne(() => Account)
  @JoinColumn({ name: 'accountId' })
  account: Account;
}
