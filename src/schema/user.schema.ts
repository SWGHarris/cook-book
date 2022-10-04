import { z } from "zod";

export const userSchema = z.object({
    id: z.string(),
    name: z.string(),
    email: z.string().email().optional(),
})

export type User = z.infer<typeof userSchema>;

// TDOD: may get rid of this.