import { z } from "zod";

export const recipeSchema = z.object({
    title: z.string(),
    authorId: z.string()
})

export type Recipe = z.infer<typeof recipeSchema>;