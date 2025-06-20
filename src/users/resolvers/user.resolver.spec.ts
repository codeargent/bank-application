import { Test, TestingModule } from '@nestjs/testing';
import { AccessTokenPayloadDto } from '../../auth/dto/common/access-token-payload.dto';
import { UserOutput } from '../dto/common/user.output';
import { UsersService } from '../users.service';
import { UserResolver } from './user.resolver';

describe('UserResolver', () => {
  let resolver: UserResolver;
  let usersService: UsersService;

  const mockUserOutput: UserOutput = {
    id: 1,
    email: 'test@example.com',
    account: {
      id: 1,
      accountNumber: '1234567890',
      balance: 100,
    },
  };

  const mockUsersService = {
    getUserById: jest.fn().mockResolvedValue(mockUserOutput),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserResolver,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    resolver = module.get<UserResolver>(UserResolver);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('getMe', () => {
    it('should return user data for the current user', async () => {
      const user: AccessTokenPayloadDto = {
        id: 1,
        email: 'test@example.com',
        accountNumber: '1234567890',
      };

      const result = await resolver.getMe(user);

      expect(usersService.getUserById).toHaveBeenCalledWith(user.id);
      expect(result).toEqual(mockUserOutput);
    });
  });
});
