import { TRPCError } from "@trpc/server";
import { recipeSchema } from "../../schema/recipe.schema";
import { createRouter } from "./context";


export const recipeRouter = createRouter()
    .query("getAll", {
        async resolve({ ctx }) {
            try {
                const result = await ctx.prisma.recipe.findMany({
                    select: {
                        title: true,
                        authorId: true,
                        steps: true
                    },
                    orderBy: {
                        createdAt: "desc",
                    },
                });

                return recipeSchema.array().parse(result);
            } catch (error) {
                console.log("error", error);
            }
        }
    })
    .middleware(async ({ctx, next}) => {
        if (!ctx.session) { throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Cannot create a new recipe without logging in."
        })}

        return next();
    })
    .mutation("postRecipe", {
        input: recipeSchema,
        async resolve({ ctx, input }) {
            try {
                await ctx.prisma.recipe.create({
                    data: {
                        title: input.title,
                        authorId: input.authorId,
                        steps: {
                            createMany: {
                                data: input.steps
                            }
                        }
                    },
                });
            } catch (error) {
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Something went wrong.'
                })
            }
        },
    });