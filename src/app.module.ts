import { Module, Logger } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersController } from './users/users.controller';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ProductsService } from './products/products.service';
import { ProductsController } from './products/products.controller';

@Module({
  controllers: [AppController, UsersController, ProductsController],
  providers: [AppService, Logger, JwtService, ProductsService],
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    UsersModule,
  ],
})
export class AppModule {}
