import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GenkitModule } from './genkit/genkit.module';
import { DatabaseModule } from './database/database.module';
import { UploadService } from './upload/upload.service';

@Module({
  imports: [GenkitModule, DatabaseModule],
  controllers: [AppController],
  providers: [AppService, UploadService],
})
export class AppModule {}
