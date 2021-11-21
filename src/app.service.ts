import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { existsSync, mkdirSync, unlinkSync, writeFileSync } from 'fs';
import { InjectModel } from 'nestjs-typegoose';
import { mapSeries } from 'p-iteration';
import { CalcCdbValueResponse } from './dtos/calc-cdb-value-response.dto';
import { CalcCdbValue } from './dtos/calc-cdb-value.dto';
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
    const { mimetype, originalname, filename } = file;
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

  async calcCdbValue(data: CalcCdbValue): Promise<CalcCdbValueResponse[]> {
    const cdiHistories = await this.cdiHistory.find({
      'dtDate': {
        $gte: new Date(data.investmentDate),
        $lt: new Date(data.currentDate)
      }
    });

    let calcResult = [];
    await mapSeries(cdiHistories, async cdi => {
      const cdiRate = (cdi.dLastTradePrice / 100 + 1) / 1 / 252 - 1;
      console.log(cdiRate);

      // calcResult.push({ date: cdi.dtDate, unitPrice: unitCdb });
    });

    return calcResult;
  }
}
