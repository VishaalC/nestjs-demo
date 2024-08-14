import {
  Controller,
  Get,
  HttpCode,
  Body,
  Ip,
  Post,
  Param,
} from '@nestjs/common';
import { CreateCatDto } from './dto/create-cat.dto';
import { CatsService } from './cats.service';
import { Cat } from './interfaces/cats.interface';

@Controller('cats')
export class CatsController {
  constructor(private catsService: CatsService) {}

  @Get()
  @HttpCode(200)
  async findAll(): Promise<Cat[]> {
    return this.catsService.findAll();
  }

  @Post()
  async sendCat(@Body() createCatDTO: CreateCatDto): Promise<String> {
    this.catsService.create(createCatDTO);
    return 'Cat added';
  }

  @Get(':id')
  findOneCat(@Param() params: any): Object {
    return params;
  }
}
