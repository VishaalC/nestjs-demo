import {
  Controller,
  Get,
  HttpCode,
  Res,
  Req,
  Body,
  Ip,
  Post,
} from '@nestjs/common';

@Controller('cats')
export class CatsController {
  //   @Get('calico')
  //   findAll(@Res() response: any) {
  //     response.status(200).send('Calico');
  //   }

  @Get('calico-normal')
  @HttpCode(200)
  find(@Body() reqBody: any, @Ip() ip: any): string {
    console.log(reqBody);
    console.log(ip);
    return 'Calico normal';
  }

  @Post('calico-normal')
  sendCat(@Body() requestBody: JSON): JSON {
    console.log(requestBody);
    return requestBody;
  }
}
