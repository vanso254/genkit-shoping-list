import { Module } from '@nestjs/common';
import { ToolService } from './tool/tool.service';
import { GenkitService } from './genkit.service';
import { ResourceService } from './resource/resource.service';

@Module({
  providers: [ToolService, GenkitService, ResourceService]
})
export class GenkitModule {}
