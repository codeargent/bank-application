import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { AccountsService } from 'src/accounts/accounts.service';
import { Repository } from 'typeorm';
import { User } from './aggregate/user.aggregate';
import { CreateUserInput } from './dto/create-user/create-user.input';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private _usersRepository: Repository<User>,
    @Inject() private readonly _accountsService: AccountsService,
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

  async createUser(createUserData: CreateUserInput): Promise<User> {
    const hashedPassword = await bcrypt.hash(createUserData.password, 10);
    const newUser = this._usersRepository.create({ email: createUserData.email, password: hashedPassword });
    const savedUser = await this._usersRepository.save(newUser);

    await this._accountsService.createAccount(savedUser.id);

    return savedUser;
  }

  async login(user: User) {
    const payload = { sub: user.id, email: user.email };
    return {
      access_token: this._jwtService.sign(payload),
    };
  }
}
