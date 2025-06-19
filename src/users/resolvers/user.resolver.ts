import { UseGuards } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';
import { AccessTokenPayloadDto } from 'src/auth/dto/common/access-token-payload.dto';
import { CurrentUser } from 'src/auth/infrastructure/decorators/current-user.decorator';
import { GqlAuthGuard } from 'src/auth/infrastructure/guards/gql-auth.guard';
import { User } from '../aggregate/user.aggregate';
import { UserOutput } from '../dto/common/user.output';
import { UsersService } from '../users.service';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly _usersService: UsersService) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => UserOutput, { nullable: true })
  async getMe(@CurrentUser() user: AccessTokenPayloadDto): Promise<UserOutput | null> {
    return this._usersService.getUserById(user.id);
  }
}
