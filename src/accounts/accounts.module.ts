import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/aggregate/user.aggregate';
import { UsersModule } from '../users/users.module';
import { AccountsService } from './accounts.service';
import { Account } from './entity/account.entity';
import { AccountResolver } from './resolvers/account.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Account, User]), forwardRef(() => UsersModule)],
  providers: [AccountResolver, AccountsService],
  exports: [AccountsService],
})
export class AccountsModule {}
