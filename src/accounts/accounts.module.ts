import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/aggregate/user.aggregate';
import { AccountsService } from './accounts.service';
import { Account } from './aggregate/account.aggregate';
import { AccountResolver } from './aggregate/account.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Account, User])],
  providers: [AccountResolver, AccountsService],
})
export class AccountsModule {}
