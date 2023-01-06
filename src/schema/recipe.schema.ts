import { string, z } from "zod";

export const recipeStepSchema = z.object({
    id: z.string(),
    recipeId: z.string(),
    order: z.number().int().nonnegative(),
    title: z.string().nullable(),
    text: string()
})

export const recipeIngredientSchema = z.object({
    recipeId: z.string(),
    order: z.number().int().nonnegative(),
    name: z.string(),
})


export type RecipeStep = z.infer<typeof recipeStepSchema>;

export const recipeSchema = z.object({
    id : z.string(),
    title: z.string(),
    authorId: z.string(),
    private: z.boolean(),
    desc: z.string(),
    steps: recipeStepSchema.array().optional(),
    ingredients: recipeIngredientSchema.array().optional()
})

export type Recipe = z.infer<typeof recipeSchema>;