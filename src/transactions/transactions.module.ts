import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './entity/transaction.entity';
import { TransactionResolver } from './resolvers/transaction.resolver';
import { TransactionsService } from './transactions.service';
import { Account } from '../accounts/entity/account.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction, Account]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '15m' },
      }),
    }),
  ],
  providers: [TransactionResolver, TransactionsService],
})
export class TransactionsModule {}
