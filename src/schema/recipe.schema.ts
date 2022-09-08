import { number, string, z } from "zod";

export const recipeStepSchema = z.object({
    recipeId: z.number().int().nonnegative(),
    stepNumber: z.number().int().positive(),
    title: z.string().optional(),
    text: string()
})

export type RecipeStep = z.infer<typeof recipeStepSchema>;

export const recipeSchema = z.object({
    id : z.number().int().nonnegative(),
    title: z.string(),
    authorId: z.string(),
    steps: recipeStepSchema.array().optional()

})

// export type Recipe = z.infer<typeof recipeSchema>;