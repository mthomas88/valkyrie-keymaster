import { CreateFastifyContextOptions } from "@trpc/server/adapters/fastify";
import { pino } from "pino";

export const logger = pino();

export const createContext = async (opts: CreateFastifyContextOptions) => {
  return {
    ...opts,
    requestId: crypto.randomUUID(),
    requestTs: Date.now(),
    logger,
    req: opts.req,
    res: opts.res,
  };
};

export type Context = Awaited<ReturnType<typeof createContext>>;
