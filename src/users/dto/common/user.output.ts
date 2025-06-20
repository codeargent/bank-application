import { Field, Int, ObjectType } from '@nestjs/graphql';
import { AccountOutput } from '../../../accounts/dto/common/account.output';

@ObjectType()
export class UserOutput {
  @Field(() => Int)
  id: number;

  @Field()
  email: string;

  @Field(() => AccountOutput, { nullable: true })
  account?: AccountOutput;
}
