import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { Logger } from '@nestjs/common';

@Module({
  providers: [UsersService, Logger],
  exports: [UsersService],
})
export class UsersModule {}
