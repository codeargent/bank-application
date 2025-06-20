import { ConflictException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { AccountsService } from '../accounts/accounts.service';
import { Repository } from 'typeorm';
import { User } from './aggregate/user.aggregate';
import { UserOutput } from './dto/common/user.output';
import { toUserOutput } from './mappers/user.mapper';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private _usersRepository: Repository<User>,
    @Inject(forwardRef(() => AccountsService)) private readonly _accountsService: AccountsService,
    private readonly _jwtService: JwtService,
  ) {}

  getUsers(): Promise<User[]> {
    return this._usersRepository.find({ relations: ['account'] });
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return await this._usersRepository
      .createQueryBuilder('user')
      .innerJoinAndSelect('user.account', 'account')
      .where('user.email = :email', { email })
      .getOne();
  }

  async getUserById(id: number): Promise<User | null> {
    return await this._usersRepository
      .createQueryBuilder('user')
      .innerJoinAndSelect('user.account', 'account')
      .where('user.id = :id', { id })
      .getOne();
  }

  async createUser(email: string, password: string): Promise<UserOutput> {
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await this.getUserByEmail(email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const newUser = this._usersRepository.create({ email: email, password: hashedPassword });
    const savedUser = await this._usersRepository.save(newUser);

    const createdAccount = await this._accountsService.createAccount(savedUser.id);

    savedUser.account = createdAccount;
    await this._usersRepository.save(savedUser);

    return toUserOutput(savedUser);
  }

  async login(user: User) {
    const payload = { sub: user.id, email: user.email };
    return {
      access_token: this._jwtService.sign(payload),
    };
  }

  async updateUser(user: User): Promise<User> {
    return this._usersRepository.save(user);
  }
}
