import { TransactionOutput } from '../dto/common/transaction.output';
import { Transaction } from '../entity/transaction.entity';

export function toTransactionOutput(transaction: Transaction): TransactionOutput {
  return {
    id: transaction.id,
    accountNumber: transaction.account.accountNumber,
    amount: transaction.amount,
    type: transaction.type,
    balance: transaction.account.balance,
    createdAt: transaction.createdAt.toISOString(),
  };
}
