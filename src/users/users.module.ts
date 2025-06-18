import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './aggregate/user.aggregate';
import { UserResolver } from './aggregate/user.resolver';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserResolver, UsersService],
})
export class UsersModule {}
