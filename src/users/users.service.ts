import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './aggregate/user.aggregate';
import { CreateUserInput } from './mutations/create-user.input';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private _usersRepository: Repository<User>) {}

  getUsers(): Promise<User[]> {
    return this._usersRepository.find({ relations: ['account'] });
  }

  async getUserById(id: number): Promise<User | null> {
    return await this._usersRepository
      .createQueryBuilder('user')
      .innerJoinAndSelect('user.account', 'account')
      .where('user.id = :id', { id })
      .getOne();
  }

  createUser(createUserData: CreateUserInput): Promise<User> {
    const newUser = this._usersRepository.create(createUserData);
    return this._usersRepository.save(newUser);
  }
}
