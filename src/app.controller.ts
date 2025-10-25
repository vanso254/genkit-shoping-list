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
    private readonly toolService: ToolService,
    private readonly resourceService: ResourceService,
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
          fileType: "application/pdf",
        })
        .addMaxSizeValidator({
          maxSize: 14 * 1024 * 1024,
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    ) file: Express.Multer.File,
  ) {
    console.log("Uploading PDF...");
    // Step 1️⃣ - Save the file to disk
    const uploadResult = await this.uploadService.handlePdfUpload(file);
    console.log("File uploaded:", uploadResult);

    // Step 2️⃣ - Process the file (extract and embed)
    const resourceResult = await this.resourceService.processResource(
      uploadResult.path,
    );

    console.log("Resource processed:", resourceResult);
const recipesOutput = resourceResult.recipes as unknown as string; //This is madness
const recipeResult = recipesOutput
  .split("\n")
  .filter(Boolean)
  .map((name) => ({ name }));


    // Step 4️⃣ - Return the full report
    return {
      message: "PDF processed and indexed successfully",
      upload: uploadResult,
      resource: resourceResult,
      recipe: recipeResult,
    };
  }
}
