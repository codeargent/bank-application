import { Field, InputType, Int } from '@nestjs/graphql';
import { IsIn, IsInt, IsOptional, Min } from 'class-validator';
import { TransactionType } from 'src/transactions/enums/transaction-type.enum';

@InputType()
export class GetTransactionsInput {
  @Field(() => TransactionType, { nullable: true, defaultValue: null })
  @IsOptional()
  @IsIn([TransactionType.DEPOSIT, TransactionType.WITHDRAW])
  type: 'deposit' | 'withdraw' | null = null;

  @Field(() => Int, { defaultValue: 1 })
  @IsInt()
  @Min(1, { message: 'Page must be greater than or equal to 1' })
  page: number = 1;

  @Field(() => Int, { defaultValue: 10 })
  @IsInt()
  @Min(0, { message: 'Limit must be a non-negative number' })
  limit: number = 10;
}
