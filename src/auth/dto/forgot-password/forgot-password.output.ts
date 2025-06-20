import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class ForgotPasswordOutput {
  @Field()
  message: string;
}
