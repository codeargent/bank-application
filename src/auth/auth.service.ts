import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthPayloadDto } from './dto/common/auth-payload.dto';
import { AccessTokenPayloadDto } from './dto/common/access-token-payload.dto';

@Injectable()
export class AuthService {
  constructor(private _jwtService: JwtService) {}

  validateUser({ email, password }: AuthPayloadDto) {
    // Replace this with database call to find the user
    const findUser = { id: 1, email, password };
    if (!findUser) return null;
    if (password !== findUser.password) return null;

    const payload: AccessTokenPayloadDto = {
      id: findUser.id,
      email: findUser.email,
    };
    return this._jwtService.sign(payload);
  }
}
