import { Socket } from "node:net";
import crypto from "crypto";
import { Packet } from "./packet";
import { logger } from "./logger";

export const setupSocket = (socket: Socket) => {
  const encoder = new TextEncoder();
  const packets: Packet[] = [];

  setInterval(() => {
    logger.debug("flushing packets");

    packets.forEach((packet) => socket.write(`${packet[0]}\n`));

    packets.length = 0;
  }, 1500);

  socket.on("error", (e) => logger.error(e));

  socket.on("data", (stream) => {
    const pktId = crypto.randomUUID();

    const recv = new Date();

    const buffer = encoder.encode(stream.toString());

    packets.push([pktId, recv, buffer]);

    logger.debug(`recv ${stream.toString()}`);

    logger.debug(`recv ${buffer.byteLength} bytes`);

    logger.debug(`recv ${packets.length} packets`);
  });
};
