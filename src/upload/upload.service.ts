import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UploadService {
  async handlePdfUpload(file: Express.Multer.File) {
    try {
      // Example: process the uploaded PDF here
      console.log('PDF uploaded:', file.originalname);
      console.log('File stored at:', file.path);

      // ✅ Add your PDF processing logic here (e.g. extract text, parse, etc.)
      // Example:
      // const pdfText = await this.extractTextFromPdf(file.path);

      return {
        message: 'PDF uploaded and processed successfully!',
        filename: file.filename,
        size: file.size,
        path: file.path,
      };
    } catch (error) {
      console.error('Error processing PDF:', error);
      throw new InternalServerErrorException(
        'Error processing uploaded PDF.',
      );
    }
  }

  //   return the file path after download
}
