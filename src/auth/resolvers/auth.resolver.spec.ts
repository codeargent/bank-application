import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UserOutput } from '../../users/dto/common/user.output';
import { UsersService } from '../../users/users.service';
import { AuthService } from '../auth.service';
import { AuthTokenDto } from '../dto/login/auth-token.output';
import { AuthResolver } from './auth.resolver';

describe('AuthResolver', () => {
  let resolver: AuthResolver;
  let usersService: jest.Mocked<UsersService>;
  let authService: jest.Mocked<AuthService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthResolver,
        {
          provide: UsersService,
          useValue: {
            createUser: jest.fn(),
          },
        },
        {
          provide: AuthService,
          useValue: {
            validateUser: jest.fn(),
            login: jest.fn(),
            forgotPassword: jest.fn(),
            resetPassword: jest.fn(),
          },
        },
      ],
    }).compile();

    resolver = module.get<AuthResolver>(AuthResolver);
    usersService = module.get(UsersService);
    authService = module.get(AuthService);
  });

  it('should register a user', async () => {
    const mockUser: UserOutput = { id: 1, email: 'test@example.com' };
    usersService.createUser.mockResolvedValue(mockUser);

    const result = await resolver.register('test@example.com', 'password123');
    expect(result).toEqual(mockUser);
    expect(usersService.createUser).toHaveBeenCalledWith('test@example.com', 'password123');
  });

  it('should login a user with valid credentials', async () => {
    const mockUser = { id: 1, email: 'test@example.com', password: 'password123' };
    const mockToken: AuthTokenDto = { access_token: 'token123' };

    authService.validateUser.mockResolvedValue(mockUser);
    authService.login.mockReturnValue(mockToken);

    const result = await resolver.login('test@example.com', 'password123');
    expect(result).toEqual(mockToken);
    expect(authService.validateUser).toHaveBeenCalledWith({ email: 'test@example.com', password: 'password123' });
    expect(authService.login).toHaveBeenCalledWith(mockUser);
  });

  it('should throw error when login credentials are invalid', async () => {
    authService.validateUser.mockResolvedValue(null);

    await expect(resolver.login('test@example.com', 'wrongpass')).rejects.toThrow(BadRequestException);
  });

  it('should send a reset password email', async () => {
    authService.forgotPassword.mockResolvedValue(true);

    const result = await resolver.forgotPassword('test@example.com');
    expect(result).toEqual({ message: 'Reset password email sent successfully' });
  });

  it('should throw error if reset password email fails', async () => {
    authService.forgotPassword.mockResolvedValue(false);

    await expect(resolver.forgotPassword('test@example.com')).rejects.toThrow(BadRequestException);
  });

  it('should reset password successfully', async () => {
    authService.resetPassword.mockResolvedValue(true);

    const result = await resolver.resetPassword('test@example.com', '123456', 'newPassword');
    expect(result).toEqual({ message: 'Password reset successfully' });
  });

  it('should throw error if password reset fails', async () => {
    authService.resetPassword.mockResolvedValue(false);

    await expect(resolver.resetPassword('test@example.com', '123456', 'newPassword')).rejects.toThrow(
      BadRequestException,
    );
  });
});
