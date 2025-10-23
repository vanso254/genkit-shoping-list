import { Module } from "@nestjs/common";
import { GenkitService } from "./genkit.service";
import { ToolService } from "./tool/tool.service";
import { ResourceService } from "./resource/resource.service";
import { DatabaseModule } from "src/database/database.module";

@Module({
  imports: [DatabaseModule],
  providers: [GenkitService, ResourceService, ToolService],
  exports:[GenkitService, ResourceService, ToolService],
})
export class GenkitModule {}
