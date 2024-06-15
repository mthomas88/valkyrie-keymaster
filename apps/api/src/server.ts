import { createHTTPServer } from "@trpc/server/adapters/standalone";
import { createContext, router } from "./trpc";

const server = createHTTPServer({ router, createContext });

server.listen(3000);
