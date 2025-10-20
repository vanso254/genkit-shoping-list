import { Injectable } from "@nestjs/common";
import { GenkitService } from "../genkit.service";
import * as fs from "fs/promises";
import { PDFParse, TextResult } from "pdf-parse";
import { chunk } from "llm-chunk";
import { ConflictException } from "@nestjs/common";
import { z } from "genkit";

// The aim here is to get the data from a file i.e pdf then index it using genkit embeddings
@Injectable()
export class ResourceService {
    constructor(private readonly genkitService: GenkitService) {}

    private async processPdf(filePath: string) {
        // 1️Read the PDF file
        const fileBuffer = await fs.readFile(filePath);

        // 2️Extract text from it
        const pdfData = new PDFParse({ data: fileBuffer });
        let textResult: TextResult | undefined;
        try {
            textResult = await pdfData.getText();
        } catch (error) {
            await pdfData.destroy();
            throw new ConflictException(
                error,
                "Failed to extract text from PDF",
            );
        } finally {
            await pdfData.destroy();
        }
        // 3) Extract plain string from the TextResult
        const text = textResult?.text ?? "";

        // chunk the file
        const chunkingConfig = {
            maxChunkSize: 800, // characters per chunk
            minChunkSize: 300,
            overlap: 100, // preserve context
        };

        const chunks = chunk(text, chunkingConfig);

        // embedd each chunk
        const embeddings = await Promise.all(
            chunks.map(async (chunkText) => {
                return this.genkitService.ai.embed({
                    embedder: "gemini-embedding-001",
                    content: chunkText,
                });
            }),
        );
        // 4) Return the extracted text, the chunks, and the embeddings
        return { text, chunks, embeddings };
    }

    async processResource(filePath: string) {
        const pdfData = await this.processPdf(filePath);
        const indexRecipe = this.genkitService.ai.defineFlow({
            name: "Recipe index",
            inputSchema: z.string(),
            outputSchema: z.string().describe(
                "A list of all ingredient names found in the recipe.",
            ),
        }, async (input) => {
            // You can use the AI instance here to analyze text, extract recipes, etc.
            const result = await this.genkitService.ai.generate({
                model: "gemini-1.5-pro",
                prompt: `List all ingredient names found in the recipe:\n${input}`,
            });
            const textOutput = result.output?.content?.[0]?.text ??
                "No output text received from model.";
            return textOutput;
        });
        const recipes = await indexRecipe.run(pdfData.text);

        return {
            recipes,
            totalChunks: pdfData.chunks.length,
            totalEmbeddings: pdfData.embeddings.length,
        };
    }
}
