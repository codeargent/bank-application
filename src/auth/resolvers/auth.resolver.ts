import { BadRequestException } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from '../auth.service';
import { AuthTokenDto } from '../dto/login/auth-token.output';

@Resolver()
export class AuthResolver {
  constructor(private _authService: AuthService) {}

  @Mutation(() => AuthTokenDto)
  async login(@Args('email') email: string, @Args('password') password: string): Promise<AuthTokenDto> {
    const user = await this._authService.validateUser({ email, password });
    if (!user) throw new BadRequestException('Invalid credentials');
    return this._authService.login(user);
  }
}
