import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { googleAI, vertexAI } from "@genkit-ai/google-genai";
import { genkit } from "genkit";
import devLocalVectorstore from "@genkit-ai/dev-local-vectorstore";
import { GenkitService } from "./genkit.service";
import { ToolService } from "./tool/tool.service";
import { ResourceService } from "./resource/resource.service";
import { DatabaseModule } from "src/database/database.module";

export const GENKIT_AI_TOKEN = "GENKIT_AI";

@Module({
  imports: [DatabaseModule],
  providers: [
    {
      provide: GENKIT_AI_TOKEN,
      useFactory: async (configService: ConfigService) => {
        const google = googleAI({
          apiKey: configService.get("GOOGLE_API_KEY"),
        });

        // Initialize Genkit asynchronously and return the ready instance
        return genkit({
          embedders: {
            "text-embedding-004": vertexAI.embedder("text-embedding-004"),
          },
          plugins: [
            google,
            vertexAI(),
            devLocalVectorstore([
              {
                indexName: "my-vector-store",
                embedder: vertexAI.embedder("text-embedding-004"),
              },
            ]),
          ],
        });
      },
      inject: [ConfigService],
    },
    GenkitService,
    ResourceService,
    ToolService,
  ],
  exports: [GenkitService, ResourceService, ToolService],
})
export class GenkitModule {}
