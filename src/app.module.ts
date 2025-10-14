import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GenkitModule } from './genkit/genkit.module';

@Module({
  imports: [GenkitModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
