import { TRPCError } from "@trpc/server";
import { myselfSchema } from "../../schema/myself.schema";
import { createRouter } from "./context";

export const myselfRouter = createRouter()
    .middleware(async ({ctx, next}) => {
        if (!ctx.session) { throw new TRPCError({code: "UNAUTHORIZED"})}

        return next();
    })
    .query("me", {
        output: myselfSchema,
        async resolve({ ctx }) {
            if (!ctx.session) { throw new TRPCError({code: "INTERNAL_SERVER_ERROR"})}
            return myselfSchema.parse(ctx.session.user);
        },
    });