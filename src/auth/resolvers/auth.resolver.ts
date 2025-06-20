import { BadRequestException } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UserOutput } from 'src/users/dto/common/user.output';
import { UsersService } from 'src/users/users.service';
import { AuthService } from '../auth.service';
import { AuthTokenDto } from '../dto/login/auth-token.output';
import { ForgotPasswordOutput } from '../dto/forgot-password/forgot-password.output';

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

  @Mutation(() => ForgotPasswordOutput)
  async forgotPassword(@Args('email') email: string): Promise<ForgotPasswordOutput> {
    const emailSent = await this._authService.forgotPassword(email);

    if (!emailSent) {
      throw new BadRequestException('Failed to send reset password email');
    }

    return { message: 'Reset password email sent successfully' };
  }

  @Mutation(() => ForgotPasswordOutput)
  async resetPassword(
    @Args('email') email: string,
    @Args('code') code: string,
    @Args('newPassword') newPassword: string,
  ): Promise<ForgotPasswordOutput> {
    const passwordReseted = await this._authService.resetPassword(email, code, newPassword);

    if (!passwordReseted) {
      throw new BadRequestException('Failed to reset password');
    }

    return { message: 'Password reset successfully' };
  }
}
