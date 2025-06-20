import { MailerService } from '@nestjs-modules/mailer';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { CacheService } from '../infrastructure/cache/cache.service';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';

const mockUser = {
  id: 1,
  email: 'test@example.com',
  password: 'hashedPassword',
  //account: { accountNumber: '1234567890' },
};

const mockPayload = {
  email: 'test@example.com',
  password: 'plainPassword',
};

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let mailerService: MailerService;
  let cacheService: CacheService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            getUserByEmail: jest.fn(),
            updateUser: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('signed-token'),
          },
        },
        {
          provide: MailerService,
          useValue: {
            sendMail: jest.fn(),
          },
        },
        {
          provide: CacheService,
          useValue: {
            set: jest.fn(),
            get: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    mailerService = module.get<MailerService>(MailerService);
    cacheService = module.get<CacheService>(CacheService);
  });

  describe('validateUser', () => {
    it('should return user if password is valid', async () => {
      jest.spyOn(usersService, 'getUserByEmail').mockResolvedValue({ ...mockUser });
      (jest.spyOn(bcrypt, 'compare') as jest.Mock).mockResolvedValue(true);

      const result = await service.validateUser(mockPayload);
      expect(result).toEqual(mockUser);
    });

    it('should return null if user does not exist', async () => {
      jest.spyOn(usersService, 'getUserByEmail').mockResolvedValue(null);

      const result = await service.validateUser(mockPayload);
      expect(result).toBeNull();
    });

    it('should return null if password is invalid', async () => {
      jest.spyOn(usersService, 'getUserByEmail').mockResolvedValue({ ...mockUser });
      (jest.spyOn(bcrypt, 'compare') as jest.Mock).mockResolvedValue(false);

      const result = await service.validateUser(mockPayload);
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return access token', () => {
      const result = service.login(mockUser);
      expect(result).toEqual({ access_token: 'signed-token' });
    });
  });

  describe('forgotPassword', () => {
    it('should return true if user does not exist (to prevent email leak)', async () => {
      jest.spyOn(usersService, 'getUserByEmail').mockResolvedValue(null);
      const result = await service.forgotPassword('nonexistent@example.com');
      expect(result).toBe(true);
    });

    it('should generate and send code if user exists', async () => {
      jest.spyOn(usersService, 'getUserByEmail').mockResolvedValue(mockUser);
      const sendMailSpy = jest.spyOn(mailerService, 'sendMail');

      const result = await service.forgotPassword(mockUser.email);

      expect(cacheService.set).toHaveBeenCalled();
      expect(sendMailSpy).toHaveBeenCalled();
      expect(result).toBe(true);
    });
  });

  describe('resetPassword', () => {
    it('should throw if code is invalid', async () => {
      jest.spyOn(cacheService, 'get').mockResolvedValue('wrong-code');

      await expect(service.resetPassword(mockUser.email, '123456', 'newPassword')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw if user does not exist', async () => {
      jest.spyOn(cacheService, 'get').mockResolvedValue('123456');
      jest.spyOn(usersService, 'getUserByEmail').mockResolvedValue(null);

      await expect(service.resetPassword(mockUser.email, '123456', 'newPassword')).rejects.toThrow(NotFoundException);
    });

    it('should update password and delete code', async () => {
      jest.spyOn(cacheService, 'get').mockResolvedValue('123456');
      jest.spyOn(usersService, 'getUserByEmail').mockResolvedValue(mockUser);

      const mockUpdatedUser = { ...mockUser, password: 'hashedNewPassword' };
      const updateSpy = jest.spyOn(usersService, 'updateUser').mockResolvedValue(mockUpdatedUser);
      const deleteSpy = jest.spyOn(cacheService, 'delete').mockResolvedValue();

      const result = await service.resetPassword(mockUser.email, '123456', 'newPassword');

      expect(updateSpy).toHaveBeenCalled();
      expect(deleteSpy).toHaveBeenCalled();
      expect(result).toBe(true);
    });
  });
});
