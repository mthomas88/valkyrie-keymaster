import { initTRPC } from "@trpc/server";
import { z } from "zod";
import { Context } from "./context";

export const t = initTRPC.context<Context>().create();

export const router = t.router({
  test: t.procedure.input(z.object({ name: z.string().min(1) })).query((q) => {
    q.ctx.logger.info("request received");

    return {
      greeting: `Hello ${q.input.name}`,
    };
  }),
});

export type Router = typeof router;
