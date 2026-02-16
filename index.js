import fs from "fs";
import path from "path";
import { createFilter } from "vite";
import { injectMetadata } from "./metadata/inject";
import { handleUpdate } from "./server/updateHandler";

export default function udit() {
  const filter = createFilter(/\.(jsx|js)$/);

  return {
    name: "Udit",
    enforce: "pre",
    transform(code, id) {
      if (!filter(id)) return null;
      if (process.env.NODE_ENV !== "development") return null;

      return injectMetadata(code, id);
    },
    configureServer(server) {
      server.middlewares.use("/udit", async (req, res) => {
        await handleUpdate(req);
        res.end("updated");
      });
    },
  };
}
