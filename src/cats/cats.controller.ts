import {
  Controller,
  Get,
  HttpCode,
  Body,
  Post,
  Param,
  // UseGuards,
} from '@nestjs/common';
import { CreateCatDto } from './dto/create-cat.dto';
import { CatsService } from './cats.service';
import { Cat } from './interfaces/cats.interface';
// import { AuthGuard } from 'src/auth/auth.guard';
// import { AuthService } from 'src/auth/auth.service';

@Controller('cats')
export class CatsController {
  constructor(private catsService: CatsService) {}

  // @UseGuards(AuthGuard)
  @Get()
  @HttpCode(200)
  async findAll(): Promise<Cat[]> {
    return this.catsService.findAll();
  }

  @Post()
  @HttpCode(201)
  async sendCat(@Body() createCatDTO: CreateCatDto): Promise<CreateCatDto> {
    this.catsService.create(createCatDTO);
    return createCatDTO;
  }

  @Get(':id')
  findOneCat(@Param() params: any): Object {
    return params;
  }
}
