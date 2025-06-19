import { Field, Int, ObjectType } from '@nestjs/graphql';
import { User } from 'src/users/aggregate/user.aggregate';
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'accounts' })
@ObjectType()
export class Account {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @OneToOne(() => User, user => user.account, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  @Field(() => User)
  user: User;

  @Column({ unique: true })
  @Field(() => Int)
  userId: number;

  @Column({ unique: true })
  @Field(() => String)
  accountNumber: string;

  @Column({ default: 0 })
  @Field(() => Int)
  balance: number;
}
