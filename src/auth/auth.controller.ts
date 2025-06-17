import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { JwtGuard } from './http/jwt.guard';
import { LocalGuard } from './http/local.guard';

@ApiTags('Auth')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  @ApiOperation({ summary: 'Login user' })
  @Post('login')
  @UseGuards(LocalGuard)
  async login(@Req() req: Request) {
    return req.user;
  }

  @Get('user')
  @UseGuards(JwtGuard)
  async status(@Req() req: Request) {
    console.log(req.user);
  }
}
