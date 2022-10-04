import { string, z, ZodSchema } from "zod";

export const recipeStepSchema = z.object({
    id: z.string(),
    recipeId: z.string(),
    order: z.number().int().positive(),
    title: z.string().optional(),
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