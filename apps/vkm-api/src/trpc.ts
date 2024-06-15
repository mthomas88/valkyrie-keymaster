import { initTRPC } from "@trpc/server";
import { CreateHTTPContextOptions } from "@trpc/server/adapters/standalone";
import pino from "pino";
import { z } from "zod";

const logger = pino();

interface CreateInnerContextOptions extends Partial<CreateHTTPContextOptions> {
  requestId: string;
  requestTs: Date;
  logger: pino.Logger;
}

export async function createContextInner(opts?: CreateInnerContextOptions) {
  return {
    requestId: crypto.randomUUID(),
    requestTs: Date.now(),
    logger,
  };
}

export const createContext = async (opts: CreateHTTPContextOptions) => {
  const contextInner = await createContextInner();
  return {
    ...contextInner,
    req: opts.req,
    res: opts.res,
  };
};

type AppCtx = Awaited<ReturnType<typeof createContext>>;

export const t = initTRPC.context<AppCtx>().create();

export const router = t.router({
  test: t.procedure.input(z.object({ name: z.string().min(1) })).query((q) => {
    q.ctx.logger.info("request received");

    return {
      greeting: `Hello ${q.input.name}`,
    };
  }),
});

export type Router = typeof router;
