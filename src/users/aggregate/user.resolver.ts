import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateUserInput } from '../mutations/create-user.input';
import { UsersService } from '../users.service';
import { User } from './user.aggregate';

export let incrementalId = 3;

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly _usersService: UsersService) {}

  @Query(() => User, { nullable: true })
  getUserById(@Args('id', { type: () => Int }) id: number) {
    return this._usersService.getUserById(id);
  }

  @Query(() => [User])
  getUsers() {
    return this._usersService.getUsers();
  }

  @Mutation(() => User)
  createUser(@Args('createUserData') createUserData: CreateUserInput) {
    return this._usersService.createUser(createUserData);
  }
}
