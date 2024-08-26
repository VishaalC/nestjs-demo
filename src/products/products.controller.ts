import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express, query } from 'express';
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
    return await this.productsService.uploadFile(file);
  }

  @Get('getRevenueByBrand')
  async getRevenueByBrand(): Promise<any> {
    return await this.productsService.getRevenueByBrand();
  }

  @Get('popularProductsByBrand')
  async findPopularProductsByBrand() {
    return await this.productsService.popularProductsByBrand();
  }

  @Get('maxPriceProduct')
  async maxPriceProduct() {
    return await this.productsService.maxPriceProduct();
  }

  @Get('popularSizesPerBrand')
  async popularSizesPerBrand() {
    return await this.productsService.popularSizesPerBrand();
  }

  @Get('searchByColorAndGender')
  async searchByColorAndGender(@Query() query) {
    return await this.productsService.searchProductByColorAndGender(
      query.color,
      query.gender,
    );
  }

  @Get('searchBetweenPriceRange')
  async searchBetweenPriceRange(@Query() query, @Body() range) {
    console.log(range);
    return await this.productsService.searchProductBetweenRange(
      query.fit_type,
      query.material,
      range.start,
      range.end,
    );
  }
}
