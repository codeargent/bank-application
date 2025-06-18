import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/aggregate/user.aggregate';
import { AccountsService } from './accounts.service';
import { Account } from './entity/account.entity';
import { AccountResolver } from './resolvers/account.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Account, User])],
  providers: [AccountResolver, AccountsService],
  exports: [AccountsService],
})
export class AccountsModule {}
