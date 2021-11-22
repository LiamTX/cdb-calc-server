import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { format } from 'date-fns';
import { existsSync, mkdirSync, unlinkSync, writeFileSync } from 'fs';
import { InjectModel } from 'nestjs-typegoose';
import { mapSeries } from 'p-iteration';
import { CalcCdbValueResponse } from './dtos/calc-cdb-value-response.dto';
import { CalcCdbValueRequest } from './dtos/calc-cdb-value.dto';
import { CdiHistory } from './entities/CdiHistory';
import { BaseService } from './shared/base.service';
import csvReader from './utils/csvReader';
import csvValidator from './utils/csvValidator';

@Injectable()
export class AppService extends BaseService<CdiHistory> {
  constructor(@InjectModel(CdiHistory) private readonly cdiHistory: ReturnModelType<typeof CdiHistory>) {
    super(cdiHistory);
  }

  async uploadCdiHistory(file: Express.Multer.File) {
    console.log(file);
    const { mimetype, filename } = file;
    const UPLOAD_PATH = './upload/'
    const filePath = `${UPLOAD_PATH}${filename}`;

    if (mimetype != 'text/csv') {
      unlinkSync(filePath);
      throw new HttpException('File invalid!', HttpStatus.BAD_REQUEST);
    }

    if (!existsSync(UPLOAD_PATH)) {
      mkdirSync(UPLOAD_PATH);
    }

    const errorsCsvValidator = await csvValidator(filePath);
    if (errorsCsvValidator) {
      unlinkSync(filePath);
      throw new HttpException(errorsCsvValidator, HttpStatus.BAD_REQUEST);
    }

    const dataCsvReader = await csvReader(filePath);
    await mapSeries(dataCsvReader, async data => {
      data.dtDate = data.dtDate.split('/').reverse().join('/');
      await this.create(data);
    });
  }

  async calcCdbValue(data: CalcCdbValueRequest): Promise<CalcCdbValueResponse[]> {
    const cdiHistories = await this.cdiHistory.find({
      'dtDate': {
        $gte: new Date(data.investmentDate),
        $lte: new Date(data.currentDate)
      }
    });

    let calcResult = [];
    await mapSeries(cdiHistories, async cdi => {
      const cdiRate = Number((Math.pow(cdi.dLastTradePrice / 100 + 1, 1 / 252) - 1).toFixed(8));
      console.log('cdiRate', cdiRate);
      const tcdiAccumulated = Number((1 + cdiRate * data.cdbRate / 100).toFixed(8));
      console.log('tcdiAccumulated', tcdiAccumulated);

      const unitCdb = 1000 * tcdiAccumulated;
      calcResult.push({ date: format(new Date(cdi.dtDate), 'yyyy-MM-dd'), unitPrice: unitCdb });
    });

    return calcResult;
  }
}
