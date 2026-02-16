import fs from "fs";
import { updateClassName } from "../utils/ast";
import { formatCode } from "../utils/prettier";

export async function handleUpdate(req) {
  let body = "";

  await new Promise((resolve) => {
    req.on("data", (chunk) => (body += chunk));
    req.on("end", resolve);
  });

  const { file, line } = JSON.parse(body);

  const code = fs.readFileSync(file, "utf-8");

  const updated = updateClassName(code, Number(line), "bg-red-500 p-6");

  const formatted = await formatCode(updated);

  fs.writeFileSync(file, formatted);
}
