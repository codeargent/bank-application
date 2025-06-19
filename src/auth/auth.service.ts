import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/aggregate/user.aggregate';
import { UsersService } from 'src/users/users.service';
import { AccessTokenPayloadDto } from './dto/common/access-token-payload.dto';
import { AuthPayloadDto } from './dto/common/auth-payload.dto';
import { AuthTokenDto } from './dto/login/auth-token.output';

@Injectable()
export class AuthService {
  constructor(
    private _jwtService: JwtService,
    private _usersService: UsersService,
  ) {}

  async validateUser({ email, password }: AuthPayloadDto) {
    const user = await this._usersService.getUserByEmail(email);
    if (!user || !user.password) return null;

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return null;

    return user;
  }

  login(user: User): AuthTokenDto {
    const payload: AccessTokenPayloadDto = {
      id: user.id,
      email: user.email,
      accountNumber: user.account?.accountNumber!,
    };

    return {
      access_token: this._jwtService.sign(payload),
    };
  }
}
