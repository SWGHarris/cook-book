import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createRouter } from "./context";


export const recipeRouter = createRouter()
    .query("getAll", {
        async resolve({ ctx }) {
            try {
                return await ctx.prisma.recipe.findMany({
                    select: {
                        name: true,
                    },
                    orderBy: {
                        createdAt: "desc",
                    },
                });
            } catch (error) {
                console.log("error", error);
            }
        }
    })
    .middleware(async ({ctx, next}) => {
        if (!ctx.session) { throw new TRPCError({code: "UNAUTHORIZED"})}

        return next();
    })
    .mutation("createRecipe", {
        input: z.object({
            name: z.string(),
            authorId: z.string()
        }),

        async resolve({ ctx, input }) {
            try {
                await ctx.prisma.recipe.create({
                    data: {
                    name: input.name,
                    authorId: input.authorId
                    },
                });
            } catch (error) {
                console.log(error);
            }
        },
    });