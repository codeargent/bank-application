import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountsModule } from './accounts/accounts.module';
import { Account } from './accounts/entity/account.entity';
import { AuthModule } from './auth/auth.module';
import { validationSchema } from './config/validation';
import { User } from './users/aggregate/user.aggregate';
import { UsersModule } from './users/users.module';
import { TransactionsModule } from './transactions/transactions.module';
import { Transaction } from './transactions/entity/transaction.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'src/schema.gql',
      formatError: error => {
        console.dir(error.extensions?.originalError, { depth: undefined });
        let message = error.message;

        if (error.extensions && error.extensions.originalError) {
          const originalError = error.extensions.originalError;

          if ('string' === typeof originalError) {
            message = originalError;
          } else if ('object' === typeof originalError && 'message' in originalError) {
            if (Array.isArray(originalError.message)) {
              message = originalError.message.join(', ');
            } else if ('string' === typeof originalError.message) {
              message = originalError.message;
            }
          }
        }

        return { message };
      },
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME || 'postgres',
      entities: [User, Account, Transaction],
      synchronize: process.env.NODE_ENV !== 'prod',
    }),
    AuthModule,
    UsersModule,
    AccountsModule,
    TransactionsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
