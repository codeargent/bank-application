import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AccessTokenPayloadDto } from 'src/auth/dto/common/access-token-payload.dto';
import { CurrentUser } from 'src/auth/infrastructure/decorators/current-user.decorator';
import { GqlAuthGuard } from 'src/auth/infrastructure/guards/gql-auth.guard';
import { User } from '../aggregate/user.aggregate';
import { CreateUserInput } from '../dto/create-user/create-user.input';
import { UsersService } from '../users.service';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly _usersService: UsersService) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => User)
  async getMe(@CurrentUser() user: AccessTokenPayloadDto) {
    return this._usersService.getUserById(user.id);
  }

  @Mutation(() => User)
  register(@Args('createUserData') createUserData: CreateUserInput) {
    return this._usersService.createUser(createUserData);
  }
}
