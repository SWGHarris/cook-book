import { z } from "zod";

export const recipeStepSchema = z.object({
    recipeId: z.number().int().nonnegative(),
    title: z.string().optional(),
    value: z.string()
})

export type RecipeStep = z.infer<typeof recipeStepSchema>;

export const recipeSchema = z.object({
    title: z.string(),
    authorId: z.string(),
    steps: recipeStepSchema.array()
})

export type Recipe = z.infer<typeof recipeSchema>;