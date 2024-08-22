import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async getProducts(): Promise<any> {
    return 'Hi';
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadData(@UploadedFile() file: Express.Multer.File): Promise<any> {
    return this.productsService.uploadFile(file);
  }
}
