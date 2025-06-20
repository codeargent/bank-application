import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from '../accounts/entity/account.entity';
import { Transaction } from './entity/transaction.entity';
import { TransactionsService } from './transactions.service';

const mockAccountRepository = () => ({
  findOneBy: jest.fn(),
  save: jest.fn(),
});

const mockTransactionRepository = () => ({
  create: jest.fn(),
  save: jest.fn(),
  createQueryBuilder: jest.fn(() => queryBuilderMock),
});

const queryBuilderMock = {
  where: jest.fn().mockReturnThis(),
  andWhere: jest.fn().mockReturnThis(),
  orderBy: jest.fn().mockReturnThis(),
  skip: jest.fn().mockReturnThis(),
  take: jest.fn().mockReturnThis(),
  innerJoinAndSelect: jest.fn().mockReturnThis(),
  getMany: jest.fn(),
};

describe('TransactionsService', () => {
  let service: TransactionsService;
  let accountRepository: jest.Mocked<Repository<Account>>;
  let transactionRepository: jest.Mocked<Repository<Transaction>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        { provide: getRepositoryToken(Account), useFactory: mockAccountRepository },
        { provide: getRepositoryToken(Transaction), useFactory: mockTransactionRepository },
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
    accountRepository = module.get(getRepositoryToken(Account));
    transactionRepository = module.get(getRepositoryToken(Transaction));
  });

  it('should throw if account not found in getTransactions', async () => {
    accountRepository.findOneBy.mockResolvedValue(null);
    await expect(service.getTransactions(1, null, 1, 10)).rejects.toThrow(BadRequestException);
  });

  it('should return transaction outputs in getTransactions', async () => {
    const account = { id: 1, userId: 1 } as Account;
    const transactions = [
      {
        id: 1,
        amount: 100,
        type: 'deposit',
        balance: 200,
        account,
        createdAt: new Date(),
      } as Transaction,
    ];

    accountRepository.findOneBy.mockResolvedValue(account);
    queryBuilderMock.getMany.mockResolvedValue(transactions);

    const result = await service.getTransactions(1, null, 1, 10);
    expect(result.length).toBe(1);
    expect(result[0].amount).toBe(100);
  });

  it('should deposit and return transaction output', async () => {
    const account = { id: 1, userId: 1, balance: 100 } as Account;
    const savedTransaction = {
      id: 1,
      amount: 50,
      type: 'deposit',
      balance: 150,
      account,
      createdAt: new Date(),
    } as Transaction;

    accountRepository.findOneBy.mockResolvedValue(account);
    accountRepository.save.mockResolvedValue(account);
    transactionRepository.create.mockReturnValue(savedTransaction);
    transactionRepository.save.mockResolvedValue(savedTransaction);

    const result = await service.deposit(1, 50);
    expect(result.amount).toBe(50);
    expect(result.type).toBe('deposit');
  });

  it('should throw if insufficient funds in withdraw', async () => {
    const account = { id: 1, userId: 1, balance: 20 } as Account;
    accountRepository.findOneBy.mockResolvedValue(account);

    await expect(service.withdraw(1, 50)).rejects.toThrow('Insufficient funds for withdrawal.');
  });

  it('should withdraw and return transaction output', async () => {
    const account = { id: 1, userId: 1, balance: 200 } as Account;
    const savedTransaction = {
      id: 1,
      amount: 100,
      type: 'withdraw',
      balance: 100,
      account,
      createdAt: new Date(),
    } as Transaction;

    accountRepository.findOneBy.mockResolvedValue(account);
    accountRepository.save.mockResolvedValue(account);
    transactionRepository.create.mockReturnValue(savedTransaction);
    transactionRepository.save.mockResolvedValue(savedTransaction);

    const result = await service.withdraw(1, 100);
    expect(result.amount).toBe(100);
    expect(result.type).toBe('withdraw');
  });
});
