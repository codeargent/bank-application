import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AccessTokenPayloadDto } from '../../auth/dto/common/access-token-payload.dto';
import { TransactionOutput } from '../dto/common/transaction.output';
import { GetTransactionsInput } from '../dto/get-transactions/get-transactions.input';
import { TransactionsService } from '../transactions.service';
import { TransactionResolver } from './transaction.resolver';

describe('TransactionResolver', () => {
  let resolver: TransactionResolver;
  let transactionsService: jest.Mocked<TransactionsService>;

  const mockTransactionsService = {
    getTransactions: jest.fn(),
    deposit: jest.fn(),
    withdraw: jest.fn(),
  };

  const mockUser: AccessTokenPayloadDto = {
    id: 1,
    email: 'test@example.com',
    accountNumber: '1234567890',
  };

  const mockTransaction: TransactionOutput = {
    id: 1,
    accountNumber: '1234567890',
    amount: 100,
    type: 'deposit',
    balance: 200,
    createdAt: new Date().toISOString(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionResolver,
        {
          provide: TransactionsService,
          useValue: mockTransactionsService,
        },
      ],
    }).compile();

    resolver = module.get<TransactionResolver>(TransactionResolver);
    transactionsService = module.get(TransactionsService);
  });

  it('should return transactions', async () => {
    mockTransactionsService.getTransactions.mockResolvedValue([mockTransaction]);

    const filters: GetTransactionsInput = { type: 'deposit', page: 1, limit: 10 };
    const result = await resolver.getTransactions(mockUser, filters);
    expect(result).toEqual([mockTransaction]);
    expect(transactionsService.getTransactions).toHaveBeenCalledWith(mockUser.id, 'deposit', 1, 10);
  });

  it('should return transactions with default filters if none provided', async () => {
    mockTransactionsService.getTransactions.mockResolvedValue([mockTransaction]);

    const result = await resolver.getTransactions(mockUser);
    expect(result).toEqual([mockTransaction]);
    expect(transactionsService.getTransactions).toHaveBeenCalledWith(mockUser.id, null, 1, 10);
  });

  it('should deposit amount', async () => {
    mockTransactionsService.deposit.mockResolvedValue(mockTransaction);
    const result = await resolver.deposit(mockUser, 100);
    expect(result).toEqual(mockTransaction);
    expect(transactionsService.deposit).toHaveBeenCalledWith(mockUser.id, 100);
  });

  it('should throw on invalid deposit amount', async () => {
    await expect(resolver.deposit(mockUser, 0)).rejects.toThrow(BadRequestException);
  });

  it('should withdraw amount', async () => {
    mockTransactionsService.withdraw.mockResolvedValue(mockTransaction);
    const result = await resolver.withdraw(mockUser, 50);
    expect(result).toEqual(mockTransaction);
    expect(transactionsService.withdraw).toHaveBeenCalledWith(mockUser.id, 50);
  });

  it('should throw on invalid withdraw amount', async () => {
    await expect(resolver.withdraw(mockUser, 0)).rejects.toThrow(BadRequestException);
  });
});
