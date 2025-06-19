import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AccountOutput {
  @Field(() => Int)
  id: number;

  @Field()
  accountNumber: string;

  @Field(() => Int)
  balance: number;
}
