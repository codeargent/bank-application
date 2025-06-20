import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../users/aggregate/user.aggregate';
import { UsersService } from '../users/users.service';
import { AccessTokenPayloadDto } from './dto/common/access-token-payload.dto';
import { AuthPayloadDto } from './dto/common/auth-payload.dto';
import { AuthTokenDto } from './dto/login/auth-token.output';
import { MailerService } from '@nestjs-modules/mailer';
import { CacheService } from '../infrastructure/cache/cache.service';

@Injectable()
export class AuthService {
  constructor(
    private _jwtService: JwtService,
    private _usersService: UsersService,
    private readonly _mailerService: MailerService,
    private readonly _cacheService: CacheService,
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

  async forgotPassword(email: string): Promise<boolean> {
    const user = await this._usersService.getUserByEmail(email);
    if (!user) return true; // não revelar que o email não existe

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    await this._cacheService.set(`reset_code:${email}`, code, 300);

    await this._mailerService.sendMail({
      to: email,
      subject: 'Reset your password for your account',
      text: `Your code is: ${code}`,
    });

    return true;
  }

  async resetPassword(email: string, code: string, newPassword: string): Promise<boolean> {
    const storedCode = await this._cacheService.get<string>(`reset_code:${email}`);
    if (storedCode !== code) {
      throw new UnauthorizedException('Invalid reset code.');
    }

    const user = await this._usersService.getUserByEmail(email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await this._usersService.updateUser(user);

    await this._cacheService.delete(`reset_code:${email}`);

    return true;
  }
}
