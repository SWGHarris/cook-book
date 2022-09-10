import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { recipeSchema, recipeStepSchema } from "../../schema/recipe.schema";
import { createRouter } from "./context";

export const recipeRouter = createRouter()
    .query("getAll", {
        output: recipeSchema.omit({steps: true}).array().optional(),
        async resolve({ ctx }) {
            try {
                const r = await ctx.prisma.recipe.findMany({
                    orderBy: {
                        createdAt: "desc",
                    },
                });
                return r;
            } catch (error) {
                console.log("error", error);
            }
        }
    })
    .middleware(async ({ctx, next}) => {
        if (!ctx.session) { throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Cannot edit recipe without logging in."
        })}

        return next();
    })
    .mutation("postRecipe", {
        // omission of id seems like a solution to keep id non-optional on zod object
        input: recipeSchema.omit({id: true}),
        output: recipeSchema,
        async resolve({ ctx, input }) {
            try {
                return await ctx.prisma.recipe.create({
                    data: {
                        title: input.title,
                        authorId: input.authorId,
                    },
                });
            } catch (error) {
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Something went wrong.'
                })
            }
        },
    })
    .mutation("postRecipeStep", {
        input: recipeStepSchema,
        async resolve({ ctx, input }) {
            try {
                await ctx.prisma.recipe.update({
                    where: { id: input.recipeId },
                    data: {
                        steps: {
                            create: {
                                stepNumber: input.stepNumber,
                                title: input.title,
                                text: input.text
                            }
                        }                    
                    }
                });
            } catch (error) {
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Something went wrong.'
                })
            }
        },
    })
    .mutation("deleteRecipes", {
        input: recipeSchema.shape.id.array(),
        async resolve({ ctx, input }) {
            const deleteSteps = ctx.prisma.recipeStep.deleteMany({
                where: {
                    recipeId: {
                        in: input
                    }
                }
            });
            const deleteRecipe = ctx.prisma.recipe.deleteMany({
                where: {
                    id: {
                        in: input
                    }
                }
            });
            try {
                await ctx.prisma.$transaction([deleteSteps, deleteRecipe]);
            } catch (error) {
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Something went wrong.'
                })
            }
        },
    });