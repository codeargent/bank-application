import { BadRequestException, UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AccessTokenPayloadDto } from 'src/auth/dto/common/access-token-payload.dto';
import { CurrentUser } from 'src/auth/infrastructure/decorators/current-user.decorator';
import { GqlAuthGuard } from 'src/auth/infrastructure/guards/gql-auth.guard';
import { Transaction } from 'src/transactions/entity/transaction.entity';
import { TransactionOutput } from '../dto/common/transaction.output';
import { GetTransactionsInput } from '../dto/get-transactions/get-transactions.input';
import { TransactionsService } from '../transactions.service';

@Resolver(() => Transaction)
export class TransactionResolver {
  constructor(private readonly _transactionsService: TransactionsService) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => [TransactionOutput])
  async getTransactions(
    @CurrentUser() user: AccessTokenPayloadDto,
    @Args('filters', { type: () => GetTransactionsInput, nullable: true }) filters?: GetTransactionsInput,
  ): Promise<TransactionOutput[]> {
    if (!filters) {
      filters = new GetTransactionsInput();
    }

    return await this._transactionsService.getTransactions(user.id, filters.type, filters.page, filters.limit);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => TransactionOutput)
  async deposit(
    @CurrentUser() user: AccessTokenPayloadDto,
    @Args('amount', { type: () => Int }) amount: number,
  ): Promise<TransactionOutput> {
    if (amount <= 0) {
      throw new BadRequestException('Deposit amount must be greater than zero.');
    }

    return await this._transactionsService.deposit(user.id, amount);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => TransactionOutput)
  async withdraw(
    @CurrentUser() user: AccessTokenPayloadDto,
    @Args('amount', { type: () => Int }) amount: number,
  ): Promise<TransactionOutput> {
    if (amount <= 0) {
      throw new BadRequestException('Withdraw amount must be greater than zero.');
    }

    return await this._transactionsService.withdraw(user.id, amount);
  }
}
