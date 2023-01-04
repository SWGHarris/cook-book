// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";
import { recipeRouter } from "./recipe.router";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("recipes.", recipeRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
