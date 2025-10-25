import { Injectable } from "@nestjs/common";
import { DatabaseService } from "src/database/database.service";
import { z } from "genkit";
import { GenkitService } from "../genkit.service";
import { Prisma } from "generated/prisma";

@Injectable()
export class ToolService {
  public addRecipeTool: ReturnType<GenkitService["ai"]["defineTool"]>;
  public viewRecipesTool: ReturnType<GenkitService["ai"]["defineTool"]>;

  constructor(
    private readonly databaseService: DatabaseService,
    private readonly genkitService: GenkitService
  ) {
    const ai = this.genkitService.ai;

    /**
     * Tool 1: Add Recipe
     */
    this.addRecipeTool = ai.defineTool(
      {
        name: "addRecipe",
        description:
          "Adds a recipe with its items (ingredients) to the database.",
        inputSchema: z.object({
          title: z.string(),
          description: z.string().optional(),
          items: z.array(
            z.object({
              name: z.string(),
              quantity: z.number().optional().default(1),
            })
          ),
        }),
        outputSchema: z.object({
          id: z.number(),
          message: z.string(),
        }),
      },
      async ({ title, description, items }) => {
        const createDto: Prisma.RecipeCreateInput = {
          title,
          description,
          items: {
            create: items.map((item) => ({
              name: item.name,
              quantity: item.quantity,
            })),
          },
        };

        const recipe = await this.databaseService.recipe.create({
          data: createDto,
          include: { _count: { select: { items: true } } },
        });

        return {
          id: recipe.id,
          message: `Recipe "${recipe.title}" with ${recipe._count.items} item(s) added successfully!`,
        };
      }
    );

    /**
     * Tool 2: View Recipes
     */
    this.viewRecipesTool = ai.defineTool(
      {
        name: "viewRecipes",
        description: "Retrieves all recipes from the database.",
        inputSchema: z.object({}),
        outputSchema: z.array(
          z.object({
            id: z.number(),
            title: z.string(),
            description: z.string().nullable(),
            itemCount: z.number(),
          })
        ),
      },
      async () => {
        const recipes = await this.databaseService.recipe.findMany({
          include: { _count: { select: { items: true } } },
        });

        return recipes.map((recipe) => ({
          id: recipe.id,
          title: recipe.title,
          description: recipe.description,
          itemCount: recipe._count.items,
        }));
      }
    );
  }
}
