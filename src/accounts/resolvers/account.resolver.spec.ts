import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AccessTokenPayloadDto } from '../../auth/dto/common/access-token-payload.dto';
import { AccountsService } from '../accounts.service';
import { GetBalanceOutput } from '../dto/get-balance/get-balance.output';
import { AccountResolver } from './account.resolver';

const mockAccountsService = {
  getAccountById: jest.fn(),
};

describe('AccountResolver', () => {
  let resolver: AccountResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountResolver,
        {
          provide: AccountsService,
          useValue: mockAccountsService,
        },
      ],
    }).compile();

    resolver = module.get<AccountResolver>(AccountResolver);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getBalance', () => {
    const mockUser: AccessTokenPayloadDto = {
      id: 1,
      email: 'test@example.com',
      accountNumber: '1234567890',
    };

    it('should return balance if account is found', async () => {
      mockAccountsService.getAccountById.mockResolvedValue({ balance: 500 });

      const result: GetBalanceOutput = await resolver.getBalance(mockUser);

      expect(result).toEqual({ balance: 500 });
      expect(mockAccountsService.getAccountById).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if account is not found', async () => {
      mockAccountsService.getAccountById.mockResolvedValue(null);

      await expect(resolver.getBalance(mockUser)).rejects.toThrow(
        new NotFoundException(`Account not found for user with ID ${mockUser.id}`),
      );
      expect(mockAccountsService.getAccountById).toHaveBeenCalledWith(1);
    });
  });
});
