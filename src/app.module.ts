import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';

require('dotenv').config();

@Module({
  imports: [
    // Insert uri mongodb env
    TypegooseModule.forRoot('', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
