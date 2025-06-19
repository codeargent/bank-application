import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TransactionOutput {
  @Field(() => Int)
  id: number;

  @Field()
  accountNumber: string;

  @Field(() => Int)
  amount: number;

  @Field(() => String)
  type: 'deposit' | 'withdraw';

  @Field(() => Int)
  balance: number;

  @Field(() => String)
  createdAt: string;
}
