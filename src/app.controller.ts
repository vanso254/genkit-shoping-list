import {
  Controller,
  Get,
  HttpStatus,
  Post,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { AppService } from "./app.service";
import { ResourceService } from "./genkit/resource/resource.service";
import { GenkitService } from "./genkit/genkit.service";
import { ToolService } from "./genkit/tool/tool.service";

import { FileInterceptor } from "@nestjs/platform-express";
import { ParseFilePipeBuilder } from "@nestjs/common";
import { UploadService } from "./upload/upload.service";

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly uploadService: UploadService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // Upload a document
  @Post("upload")
  @UseInterceptors(FileInterceptor("file"))
  async uploadPdf(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: "application/pdf", // ✅ Only allow PDF
        })
        .addMaxSizeValidator({
          maxSize: 14 * 1024 * 1024, // ✅ Max file size = 14MB
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    ) file: Express.Multer.File,
  ) {
    return this.uploadService.handlePdfUpload(file);
  }
}
