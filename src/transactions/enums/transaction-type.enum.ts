/* eslint-disable no-unused-vars */
import { registerEnumType } from '@nestjs/graphql';

export enum TransactionType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

registerEnumType(TransactionType, {
  name: 'TransactionType',
});
