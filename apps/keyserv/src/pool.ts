import { Socket } from "node:net";
import crypto from "crypto";
import { setupSocket } from "./socket";
import { logger } from "./logger";

export type Pool = Map<string, { socket: Socket; recv: Date }>;

export const addToPool = (socket: Socket, pool: Pool) => {
  const connId = crypto.randomUUID();

  logger.debug(`client with id ${connId} connected, adding to pool...`);

  try {
    setupSocket(socket);

    pool.set(connId, { socket, recv: new Date() });

    logger.debug(`connection pool is ${pool.size}`);
  } catch (err) {
    logger.debug(
      `failed to setup socket and add to pool, keyserv will reset and destroy socket`,
    );

    socket.resetAndDestroy();

    logger.error(err, "KEYSERV_ERR");
  }
};
