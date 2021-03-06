import { Body, Controller, Get, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { CalcCdbValueResponse } from './dtos/calc-cdb-value-response.dto';
import { CalcCdbValueRequest } from './dtos/calc-cdb-value.dto';

@ApiTags('APP')
@Controller('/api')
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  @ApiOperation({ description: 'Health Check endpoint' })
  healthCheck() {
    return 'WORKING';
  }

  @Post('/upload/cdi')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ description: 'Upload csv file with cdi history' })
  @ApiResponse({ status: 201, description: 'File uploaded and processed' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadCdiHistory(@UploadedFile() file: Express.Multer.File) {
    return await this.appService.uploadCdiHistory(file);
  }

  @Post('/cdb')
  @ApiResponse({ status: 200, type: CalcCdbValueResponse })
  async calcCdbValue(@Body() data: CalcCdbValueRequest) {
    return await this.appService.calcCdbValue(data);
  }
}
