// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { exampleRouter } from "./example";
import { transactionsRouter } from "./transactions";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("example.", exampleRouter)
  .merge("transactions", transactionsRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
