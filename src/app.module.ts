import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { validationSchema } from './config/validation';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema,
    }),
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
