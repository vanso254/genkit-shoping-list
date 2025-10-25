import { z } from "genkit";
import { GenkitService } from "../genkit.service";

/**
 * This factory function defines a Genkit flow
 * that can be registered once  NestJS GenkitService is ready.
 */
export const createIndexRecipeFlow = (ai: GenkitService["ai"]) =>
  ai.defineFlow(
    {
      name: "Recipe index",
      inputSchema: z.string(),
      outputSchema: z.string().describe(
        "A list of all ingredient names found in the recipe."
      ),
    },
    async (input) => {
      const result = await ai.generate({
        model: "gemini-1.5-pro",
        prompt: `List all ingredient names found in the recipe:\n${input}`,
      });

      const textOutput =
        result.output?.content?.[0]?.text ??
        "No output text received from model.";

      return textOutput;
    }
  );