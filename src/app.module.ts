import { Module } from '@nestjs/common';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from './app/middlewares/GlobalExceptionFilter';
import { PrismaModule } from './shared/prisma.module';
import { AuthModule } from './app/modules/auth/auth.module';
import { UsersModule } from './app/modules/users/users.module';

@Module({
  imports: [PrismaModule, AuthModule, UsersModule],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    },
  ],
})
export class AppModule {}
