import net from "node:net";
import crypto from "crypto";
import { Pool, addToPool } from "./pool";
import { logger } from "./logger";

type PacketID = string;
type PacketTimestamp = Date;
type PacketBuffer = Uint8Array;

export type Packet = [PacketID, PacketTimestamp, PacketBuffer];

export const slog = (id: string, name = "keyserv") =>
  `${name}(pid: ${process.pid}, id: ${id})`;

export const startupPacketHandler = (opts: {
  processId: number;
  port: string;
  isLeader: boolean;
}) => {
  const id = crypto.randomUUID();
  const pool: Pool = new Map();

  const packetHandler = net.createServer((socket) => addToPool(socket, pool));

  packetHandler.once("listening", () => {
    logger.info(
      `${slog(id)} keyserv is listening on port ${Number(opts.port)} and running with pid ${opts.processId}`,
    );
    if (opts.isLeader) {
      logger.info(`${slog(id)} keyserv with pid ${opts.processId} is leader`);
    }
  });

  packetHandler.on("error", (err) => {
    logger.error(err, "KEYSERV_ERR");
  });

  packetHandler.on("close", () => {
    logger.info(`${slog(id)} keyserv closed`);
  });

  packetHandler.on("listening", () => {
    logger.info(`${slog(id)} keyserv listening`);
  });

  return {
    start: () => packetHandler.listen(opts.port),
    stop: () => packetHandler.close(),
    pool,
  };
};
