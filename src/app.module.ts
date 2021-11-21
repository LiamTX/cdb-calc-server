import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypegooseModule } from 'nestjs-typegoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CdiHistory } from './entities/CdiHistory';

require('dotenv').config();

@Module({
  imports: [
    // Insert uri mongodb env
    TypegooseModule.forRoot(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    }),
    TypegooseModule.forFeature([CdiHistory]),
    MulterModule.registerAsync({
      useFactory: () => ({
        dest: './upload',
      }),
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
