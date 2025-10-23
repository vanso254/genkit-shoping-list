import { Injectable, InternalServerErrorException } from "@nestjs/common";
// import * as fs from "fs";
import * as fs from "fs/promises";
import * as path from "path";

@Injectable()
export class UploadService {
  async handlePdfUpload(file: Express.Multer.File) {
    try {
      // Example: process the uploaded PDF here
      console.log("PDF uploaded:", file.originalname);

      // ✅ Add your PDF processing logic here (e.g. extract text, parse, etc.)
      // Example:
      // const pdfText = await this.extractTextFromPdf(file.path);

      // Define upload directory
      const uploadDir = path.join(process.cwd(), "uploads");
      // Ensure upload directory exists. If does not exist, create it
      await fs.mkdir(uploadDir, { recursive: true });

      const uniqueName = `${Date.now()}-${file.originalname}`;
      const filePath = path.join(uploadDir, uniqueName);

      await fs.writeFile(filePath, file.buffer);

      console.log("File stored at:", filePath);

      return {
        message: "PDF uploaded and processed successfully!",
        filename: file.filename,
        size: file.size,
        url: `/uploads/${uniqueName}`,
      };
    } catch (error) {
      console.error("Error processing PDF:", error);
      throw new InternalServerErrorException(
        "Error processing uploaded PDF.",
      );
    }
  }
}
