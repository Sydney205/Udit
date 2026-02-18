import fs from "fs";
import path from "path";
import { createFilter } from "vite";
import { injectMetadata } from "./utils/ast";
import { handleUpdate } from "./server/updateHandler";

export default function udit() {
  const filter = createFilter(/\.(jsx|js)$/);

  return {
    name: "Udit",
    enforce: "pre",

    resolveId(id) {
      if (id === "virtual:udit") {
        return id
      }
    },

    load(id) {
      if (id === "virtual:udit") {
        return `
          import "../udit/client/client.js";
        `
      }
    },
    
    transform(code, id) {
      if (!filter(id)) return null;
      if (process.env.NODE_ENV !== "development") return null;

      const withMetadata = injectMetadata(code, id)

      return `
        ${withMetadata}

        import "virtual:udit";
      `;
    },
    configureServer(server) {
      server.middlewares.use("/udit", async (req, res) => {
        await handleUpdate(req);
        res.end("updated");
      });
    },
  };
}
