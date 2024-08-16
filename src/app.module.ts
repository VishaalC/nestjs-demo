import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatsController } from './cats/cats.controller';
import { DogsModule } from './dogs/dogs.module';
import { CatsService } from './cats/cats.service';
import { CatsModule } from './cats/cat.module';
import { UsersController } from './users/users.controller';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseService } from './database/database.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [AppController, UsersController],
  providers: [AppService, DatabaseService],
  imports: [DogsModule, CatsModule, UsersModule, ConfigModule.forRoot()],
})
export class AppModule {}
