import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class GetBalanceOutput {
  @Field(() => Int)
  balance: number;
}
