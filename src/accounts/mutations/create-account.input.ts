import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateAccountInput {
  @Field(() => Int)
  userId: number;
}
