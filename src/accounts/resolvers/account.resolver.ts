import { NotFoundException, UseGuards } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';
import { Account } from '../entity/account.entity';
import { AccessTokenPayloadDto } from '../../auth/dto/common/access-token-payload.dto';
import { CurrentUser } from '../../auth/infrastructure/decorators/current-user.decorator';
import { GqlAuthGuard } from '../../auth/infrastructure/guards/gql-auth.guard';
import { AccountsService } from '../accounts.service';
import { GetBalanceOutput } from '../dto/get-balance/get-balance.output';

@Resolver(() => Account)
export class AccountResolver {
  constructor(private readonly _accountsService: AccountsService) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => GetBalanceOutput)
  async getBalance(@CurrentUser() user: AccessTokenPayloadDto) {
    const account = await this._accountsService.getAccountById(user.id);

    if (!account) {
      throw new NotFoundException(`Account not found for user with ID ${user.id}`);
    }

    return { balance: account.balance };
  }
}
