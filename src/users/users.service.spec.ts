import { ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { AccountsService } from '../accounts/accounts.service';
import { User } from './aggregate/user.aggregate';
import { UsersService } from './users.service';

const mockUser: User = {
  id: 1,
  email: 'test@example.com',
  password: 'hashedPassword',
};

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        JwtService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            create: jest.fn().mockReturnValue(mockUser),
            save: jest.fn().mockResolvedValue(mockUser),
            find: jest.fn().mockResolvedValue([mockUser]),
            createQueryBuilder: jest.fn().mockReturnValue({
              innerJoinAndSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              getOne: jest.fn().mockResolvedValue(mockUser),
            }),
          },
        },
        {
          provide: AccountsService,
          useValue: {
            createAccount: jest.fn().mockResolvedValue(mockUser.account),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should create a user', async () => {
    jest.spyOn(service, 'getUserByEmail').mockResolvedValueOnce(null);
    (jest.spyOn(bcrypt, 'hash') as jest.Mock).mockResolvedValue('hashedPassword');

    const result = await service.createUser('test@example.com', '123456');
    expect(result.email).toBe('test@example.com');
  });

  it('should throw if user already exists', async () => {
    jest.spyOn(service, 'getUserByEmail').mockResolvedValue(mockUser);
    await expect(service.createUser('test@example.com', '123456')).rejects.toThrow(ConflictException);
  });

  it('should return user by email', async () => {
    const result = await service.getUserByEmail('test@example.com');
    expect(result).toEqual(mockUser);
  });

  it('should return user by id', async () => {
    const result = await service.getUserById(1);
    expect(result).toEqual(mockUser);
  });

  it('should update a user', async () => {
    const result = await service.updateUser(mockUser);
    expect(result).toEqual(mockUser);
  });

  it('should login and return token', async () => {
    const jwtSignSpy = jest.spyOn(JwtService.prototype, 'sign').mockReturnValue('fakeToken');
    const result = await service.login(mockUser);
    expect(result.access_token).toBe('fakeToken');
    expect(jwtSignSpy).toHaveBeenCalledWith({ sub: mockUser.id, email: mockUser.email });
  });
});
