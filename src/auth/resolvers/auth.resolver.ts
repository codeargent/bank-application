import { BadRequestException } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UserOutput } from 'src/users/dto/common/user.output';
import { UsersService } from 'src/users/users.service';
import { AuthService } from '../auth.service';
import { AuthTokenDto } from '../dto/login/auth-token.output';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly _authService: AuthService,
    private readonly _usersService: UsersService,
  ) {}

  @Mutation(() => UserOutput)
  register(@Args('email') email: string, @Args('password') password: string): Promise<UserOutput> {
    return this._usersService.createUser(email, password);
  }

  @Mutation(() => AuthTokenDto)
  async login(@Args('email') email: string, @Args('password') password: string): Promise<AuthTokenDto> {
    const user = await this._authService.validateUser({ email, password });
    if (!user) throw new BadRequestException('Invalid credentials');
    return this._authService.login(user);
  }
}
