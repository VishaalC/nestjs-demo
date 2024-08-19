import { Module, Logger } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DogsModule } from './dogs/dogs.module';
import { CatsModule } from './cats/cat.module';
import { UsersController } from './users/users.controller';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [AppController, UsersController],
  providers: [AppService, Logger],
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    DogsModule,
    CatsModule,
    UsersModule,
  ],
})
export class AppModule {}
