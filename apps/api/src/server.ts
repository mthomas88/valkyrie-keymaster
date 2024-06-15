import {
  FastifyTRPCPluginOptions,
  fastifyTRPCPlugin,
} from "@trpc/server/adapters/fastify";
import fastify from "fastify";
import { Router, router } from "./router";
import { createContext, logger } from "./context";

export interface ServerOptions {
  dev?: boolean;
  port?: number;
  prefix?: string;
}

export function createServer(opts: ServerOptions) {
  const dev = opts.dev ?? true;
  const port = opts.port ?? 3000;
  const prefix = opts.prefix ?? "/trpc";
  const server = fastify({ logger: dev, maxParamLength: 5000 });

  void server.register(fastifyTRPCPlugin, {
    prefix,
    trpcOptions: {
      router,
      createContext,
      onError({ path, error }) {
        logger.error({
          error,
          msg: `Error in tRPC handler on path '${path}':`,
        });
      },
    } satisfies FastifyTRPCPluginOptions<Router>["trpcOptions"],
  });

  server.get("/", async () => {
    return { hello: "wait-on 💨" };
  });

  const stop = async () => {
    await server.close();
  };

  const start = async () => {
    try {
      await server.listen({ port });
      logger.info(`server listening on port ${port}`);
    } catch (err) {
      server.log.error(err);
      logger.fatal("api server shutdown");
      process.exit(1);
    }
  };

  return { server, start, stop };
}
