import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatsController } from './cats/cats.controller';
import { DogsModule } from './dogs/dogs.module';
import { CatsService } from './cats/cats.service';
import { CatsModule } from './cats/cat.module';

@Module({
  controllers: [AppController, CatsController],
  providers: [AppService, CatsService],
  imports: [DogsModule, CatsModule],
})
export class AppModule {}
