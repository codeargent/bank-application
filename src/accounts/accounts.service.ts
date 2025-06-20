import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from '../users/users.service';
import { Repository } from 'typeorm';
import { Account } from './entity/account.entity';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(Account) private _accountRepository: Repository<Account>,
    @Inject(forwardRef(() => UsersService)) private readonly _usersService: UsersService,
  ) {}

  getAccountById(userId: number): Promise<Account | null> {
    return this._accountRepository.findOneBy({ userId });
  }

  getAccounts(): Promise<Account[]> {
    return this._accountRepository.find();
  }

  async createAccount(userId: number): Promise<Account> {
    const accountNumber = await this.generateUniqueAccountNumber();

    const newAccount = this._accountRepository.create({ userId, accountNumber });
    const savedAccount = await this._accountRepository.save(newAccount);

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
