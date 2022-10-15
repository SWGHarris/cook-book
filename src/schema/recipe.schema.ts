import { string, z } from "zod";

export const recipeStepSchema = z.object({
    id: z.string(),
    recipeId: z.string(),
    title: z.string().nullable(),
    text: string()
})

export type RecipeStep = z.infer<typeof recipeStepSchema>;

export const recipeSchema = z.object({
    id : z.string(),
    title: z.string(),
    authorId: z.string(),
    desc: z.string(),
    steps: recipeStepSchema.array().optional()
})

export type Recipe = z.infer<typeof recipeSchema>;