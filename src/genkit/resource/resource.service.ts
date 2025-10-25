import { ConflictException, Injectable } from "@nestjs/common";
import { GenkitService } from "../genkit.service";
import * as fs from "fs/promises";
import { PDFParse, TextResult } from "pdf-parse";
import { chunk } from "llm-chunk";
import { createIndexRecipeFlow } from "./indexRecipe.flow";

@Injectable()
export class ResourceService {
    constructor(private readonly genkitService: GenkitService) {}

    private async processPdf(filePath: string) {
        const fileBuffer = await fs.readFile(filePath);

        console.log("Extracting text from PDF...");
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

        const text = textResult?.text ?? "";
        console.log("Chunking the data...");

        const chunks = chunk(text, {
            maxLength: 800,
            minLength: 300,
            overlap: 100,
        });

        console.log(`Total chunks created: ${chunks.length}`);
        console.log("Embedding each chunk...");

        const embeddings = await Promise.all(
            chunks.map(async (chunkText) =>
                this.genkitService.ai.embed({
                    embedder: "text-embedding-004",
                    content: chunkText,
                    options: {
                        taskType: "RETRIEVAL_DOCUMENT",
                    },
                })
            ),
        );

        console.log(`Total embeddings created: ${embeddings.length}`);

        return { text, chunks, embeddings };
    }

    async processResource(filePath: string) {
        console.log("Processing resource at:", filePath);
        const pdfData = await this.processPdf(filePath);
        const indexRecipeFlow = createIndexRecipeFlow(this.genkitService.ai);

        // ✅ FIXED: use static flow (discoverable)
        console.log("Indexing recipes from PDF text...");
        const recipesText = await indexRecipeFlow.run(pdfData.text);

        return {
            recipes: recipesText,
            totalChunks: pdfData.chunks.length,
            totalEmbeddings: pdfData.embeddings.length,
        };
    }
}
