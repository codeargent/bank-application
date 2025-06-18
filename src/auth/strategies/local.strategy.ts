import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private _authService: AuthService) {
    super();
  }

  validate(email: string, password: string) {
    const token = this._authService.validateUser({ email, password });
    if (!token) throw new UnauthorizedException();
    return token;
  }
}
