import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Account } from 'src/accounts/aggregate/account.aggregate';
import { AccountsService } from '../accounts.service';
import { CreateAccountInput } from '../mutations/create-account.input';

@Resolver(() => Account)
export class AccountResolver {
  constructor(private readonly _accountsService: AccountsService) {}

  @Query(() => Account, { nullable: true })
  getAccountById(@Args('id', { type: () => Int }) id: number) {
    return this._accountsService.getAccountById(id);
  }

  @Query(() => [Account])
  getAccount() {
    return this._accountsService.getAccounts();
  }

  @Mutation(() => Account)
  async createAccount(@Args('createAccountData') createAccountData: CreateAccountInput) {
    return await this._accountsService.createAccount(createAccountData);
  }
}
