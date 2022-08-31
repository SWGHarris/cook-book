import { TRPCError } from "@trpc/server";
import { type } from "os";
import { resolve } from "path";
import { recipeSchema, recipeStepSchema } from "../../schema/recipe.schema";
import { Context, createRouter } from "./context";
import z from "zod";

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
            message: "Cannot edit recipe without logging in."
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
    .mutation("deleteRecipe", {
        input: recipeSchema.pick({id: true}),
        async resolve({ ctx, input }) {
            const deleteSteps = ctx.prisma.recipeStep.deleteMany({
                where: {recipeId: input.id}
            });
            const deleteRecipe = ctx.prisma.recipe.delete({
                where: {id: input.id}
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