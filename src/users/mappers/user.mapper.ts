import { User } from '../aggregate/user.aggregate';
import { UserOutput } from '../dto/common/user.output';

export function toUserOutput(user: User): UserOutput {
  return {
    id: user.id,
    email: user.email,
    account: user.account && {
      id: user.account.id,
      accountNumber: user.account.accountNumber,
      balance: user.account.balance,
    },
  };
}
