import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GenkitModule } from './genkit/genkit.module';
import { DatabaseModule } from './database/database.module';
import { UploadService } from './upload/upload.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [GenkitModule, DatabaseModule,ConfigModule.forRoot({ isGlobal: true })],
  controllers: [AppController],
  providers: [AppService, UploadService],
})
export class AppModule {}
