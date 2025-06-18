import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/aggregate/user.aggregate';
import { Repository } from 'typeorm';
import { Account } from './aggregate/account.aggregate';
import { CreateAccountInput } from './mutations/create-account.input';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(Account) private _accountRepository: Repository<Account>,
    @InjectRepository(User) private readonly _usersRepository: Repository<User>,
  ) {}

  getAccountById(userId: number): Promise<Account | null> {
    return this._accountRepository.findOneBy({ userId });
  }

  getAccounts(): Promise<Account[]> {
    return this._accountRepository.find();
  }

  async createAccount(createAccountData: CreateAccountInput): Promise<Account> {
    const user = await this._usersRepository.findOneBy({ id: createAccountData.userId });

    if (!user) {
      throw new BadRequestException(`User with ID ${createAccountData.userId} does not exist.`);
    }

    const accountNumber = await this.generateUniqueAccountNumber();

    const newAccount = this._accountRepository.create({ userId: createAccountData.userId, accountNumber });
    const savedAccount = await this._accountRepository.save(newAccount);

    user.account = savedAccount;
    await this._usersRepository.save(user);

    return savedAccount;
  }

  private async generateUniqueAccountNumber(): Promise<string> {
    let exists = true;
    let accountNumber = '';

    while (exists) {
      // Generates a 10-digit random number
      accountNumber = Math.floor(1000000000 + Math.random() * 9000000000).toString();

      exists = !!(await this._accountRepository.findOneBy({ accountNumber }));
    }

    return accountNumber;
  }
}
