import { TRPCError } from "@trpc/server";
import { userSchema } from "../../schema/user.schema";
import { createRouter } from "./context";

export const userRouter = createRouter()
    .query("getUser", {
        input : userSchema.pick({id : true}),
        async resolve({ ctx, input }) {
            try {
                return ctx.prisma.user.findUnique({
                    where : {
                        id: input.id
                    }
                });
            } catch (error) {
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Something went wrong.'
                })
            }
        },
    });