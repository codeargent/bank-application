import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from '../accounts/entity/account.entity';
import { Repository } from 'typeorm';
import { Transaction } from './entity/transaction.entity';
import { TransactionOutput } from './dto/common/transaction.output';
import { toTransactionOutput } from './mappers/transaction.mapper';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction) private _transactionRepository: Repository<Transaction>,
    @InjectRepository(Account) private readonly _accountRepository: Repository<Account>,
  ) {}

  async getTransactions(
    userId: number,
    type: string | null,
    page: number,
    limit: number,
  ): Promise<TransactionOutput[]> {
    const account = await this._accountRepository.findOneBy({ userId });

    if (!account) {
      throw new BadRequestException(`Current user does not have an account.`);
    }

    const skip = (page - 1) * limit;
    const query = this._transactionRepository
      .createQueryBuilder('transaction')
      .where('transaction.accountId = :accountId', { accountId: account.id })
      .orderBy('transaction.createdAt', 'DESC')
      .skip(skip)
      .take(limit);

    if (type) {
      query.andWhere('transaction.type = :type', { type });
    }

    const transactions = await query.innerJoinAndSelect('transaction.account', 'account').getMany();
    return transactions.map(toTransactionOutput);
  }

  async deposit(userId: number, amount: number): Promise<TransactionOutput> {
    const account = await this._accountRepository.findOneBy({ userId });

    if (!account) {
      throw new BadRequestException(`Current user does not have an account.`);
    }

    account.balance += amount;
    await this._accountRepository.save(account);

    const transaction = this._transactionRepository.create({
      amount,
      type: 'deposit',
      balance: account.balance + amount,
      account: account,
    });

    const savedTransaction = await this._transactionRepository.save(transaction);
    return toTransactionOutput(savedTransaction);
  }

  async withdraw(userId: number, balance: number): Promise<TransactionOutput> {
    const account = await this._accountRepository.findOneBy({ userId });

    if (!account) {
      throw new BadRequestException(`User with ID ${userId} does not exist.`);
    }

    if (balance <= 0) {
      throw new BadRequestException('Withdrawal amount must be greater than zero.');
    }

    if (account.balance < balance) {
      throw new BadRequestException('Insufficient funds for withdrawal.');
    }

    account.balance -= balance;
    await this._accountRepository.save(account);

    const transaction = this._transactionRepository.create({
      amount: balance,
      type: 'withdraw',
      balance: account.balance - balance,
      account: account,
    });

    const savedTransaction = await this._transactionRepository.save(transaction);
    return toTransactionOutput(savedTransaction);
  }
}
