import { z } from "zod";

export const myselfSchema = z.object({
    id: z.string(),
    name: z.string(),
    email: z.string().email(),
})

export type Myself = z.infer<typeof myselfSchema>;