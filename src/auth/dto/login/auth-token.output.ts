import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class AuthTokenDto {
  @Field()
  access_token: string;
}
