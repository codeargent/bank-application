import { ApiProperty } from '@nestjs/swagger';

export class AccessTokenPayloadDto {
  @ApiProperty({ description: 'User ID' })
  readonly id: number;

  @ApiProperty({ description: 'User email' })
  readonly email: string;
}
