import {
  Controller,
  Get,
  HttpCode,
  Res,
  Req,
  Body,
  Ip,
  Post,
  Param,
} from '@nestjs/common';
import { CreateCatDto } from './create-cat.dto';

@Controller('cats')
export class CatsController {
  //   @Get('calico')
  //   findAll(@Res() response: any) {
  //     response.status(200).send('Calico');
  //   }

  @Get('calico-normal')
  @HttpCode(200)
  findAll(@Body() reqBody: any, @Ip() ip: any): Object {
    console.log(reqBody);
    console.log(ip);
    let req = { calico: 'cat' };
    return req;
  }

  @Post('calico-normal')
  async sendCat(@Body() createCatDTO: CreateCatDto) {
    return createCatDTO;
  }

  @Get(':id')
  findOneCat(@Param() params: any): Object {
    return params;
  }
}
