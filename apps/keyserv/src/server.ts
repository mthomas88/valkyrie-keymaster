import { startupPacketHandler } from "./packet";

const IS_LEADER = Boolean(process.env.IS_LEADER_NODE) || true;
const KEYSERV_PORT = process.env.TCP_PORT || "4000";
const PROCESS_ID = process.pid;

const keyserv = startupPacketHandler({
  isLeader: IS_LEADER,
  processId: PROCESS_ID,
  port: KEYSERV_PORT,
});

keyserv.start();

process.on("SIGINT", () => {
  keyserv.stop();
});

process.on("SIGTERM", () => {
  keyserv.stop();
});
