import { Injectable,OnModuleInit } from "@nestjs/common";
import { genkit, z } from "genkit";
import { googleAI } from "@genkit-ai/google-genai";
import devLocalVectorstore from "@genkit-ai/dev-local-vectorstore";

@Injectable()
export class GenkitService implements OnModuleInit {
    public ai: Awaited<ReturnType<typeof genkit>>;
    async onModuleInit() {
        this.ai = genkit({
            plugins: [
                googleAI(),
                devLocalVectorstore([
                    {
                        indexName: "my-vector-store",
                        embedder: googleAI.embedder("gemini-embedding-001"),
                    },
                ]),
            ],
        });
    }
}
