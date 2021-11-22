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

// App service class
@Injectable()
export class AppService extends BaseService<CdiHistory> {
  // Instantiating the cdi history model on constructor service
  constructor(@InjectModel(CdiHistory) private readonly cdiHistory: ReturnModelType<typeof CdiHistory>) {
    super(cdiHistory);
  }

  // Upload csv with cdi history
  async uploadCdiHistory(file: Express.Multer.File) {
    const { mimetype, filename } = file;
    // Set upload file path
    const UPLOAD_PATH = './upload/'
    const filePath = `${UPLOAD_PATH}${filename}`;

    // Verify if is .csv
    if (mimetype != 'text/csv') {
      unlinkSync(filePath);
      throw new HttpException('File invalid!', HttpStatus.BAD_REQUEST);
    }

    if (!existsSync(UPLOAD_PATH)) {
      mkdirSync(UPLOAD_PATH);
    }

    // Validate csv headers
    const errorsCsvValidator = await csvValidator(filePath);
    if (errorsCsvValidator) {
      unlinkSync(filePath);
      throw new HttpException(errorsCsvValidator, HttpStatus.BAD_REQUEST);
    }

    // Read csv
    const dataCsvReader = await csvReader(filePath);
    await mapSeries(dataCsvReader, async data => {
      // Create cdi histories on database from csv file
      data.dtDate = data.dtDate.split('/').reverse().join('/');
      await this.create(data);
    });

    unlinkSync(filePath);
  }

  // Calculate unit cdb price
  async calcCdbValue(data: CalcCdbValueRequest): Promise<CalcCdbValueResponse[]> {
    // Find cdi histories between two dates
    const cdiHistories = await this.cdiHistory.find({
      'dtDate': {
        $gte: new Date(data.investmentDate),
        $lte: new Date(data.currentDate)
      }
    });

    let calcResult = [];
    // Scroll all cdi histories
    await mapSeries(cdiHistories, async cdi => {
      // Calc cdi rate
      const cdiRate = Number((Math.pow(cdi.dLastTradePrice / 100 + 1, 1 / 252) - 1).toFixed(8));
      // Calc tcdi accumulated with cdi rate
      const tcdiAccumulated = Number((1 + cdiRate * data.cdbRate / 100).toFixed(8));

      // Calc cdb unit price with tcdi accumulated
      const unitCdb = 1000 * tcdiAccumulated;
      // Add the unite price to response array
      calcResult.push({ date: format(new Date(cdi.dtDate), 'yyyy-MM-dd'), unitPrice: unitCdb });
    });

    return calcResult;
  }
}
