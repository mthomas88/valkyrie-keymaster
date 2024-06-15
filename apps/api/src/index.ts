import { serverConfig } from "./config.base";
import { createServer } from "./server";

const server = createServer(serverConfig);

void server.start();
