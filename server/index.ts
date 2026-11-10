import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";

// `pnpm build` emits the client to dist/public and this file to dist/index.js,
// so the public directory always sits next to the bundle.
const publicDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "public"
);

const app = express();
app.use(express.static(publicDir));
app.get("*", (_request, response) => {
  response.sendFile(path.join(publicDir, "index.html"));
});

const port = Number(process.env.PORT) || 3000;
app.listen(port, () => {
  console.log(`Servidor em execução em http://localhost:${port}/`);
});
