import { Injectable, Inject } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { genkit } from "genkit";
import { GENKIT_AI_TOKEN } from "./genkit.module";

@Injectable()
export class GenkitService {
  public ai: Awaited<ReturnType<typeof genkit>>;

  constructor(
    @Inject(GENKIT_AI_TOKEN)
    aiInstance: Awaited<ReturnType<typeof genkit>>,
    private readonly configService: ConfigService
  ) {
    this.ai = aiInstance;
  }
}
