import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
const root = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../apps/docs/out",
);
const mime = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".ttf": "font/ttf",
  ".txt": "text/plain",
};
export async function serveDocs(port = 4313) {
  const server = createServer(async (request, response) => {
    try {
      const url = new URL(request.url || "/", "http://localhost");
      if (url.pathname === "/") {
        response.writeHead(302, { Location: "/bubbas-ui/" });
        response.end();
        return;
      }
      if (!url.pathname.startsWith("/bubbas-ui/")) throw new Error("not found");
      const relative = decodeURIComponent(
        url.pathname.slice("/bubbas-ui/".length),
      );
      let file = path.resolve(root, relative);
      if (file !== root && !file.startsWith(`${root}${path.sep}`))
        throw new Error("invalid path");
      if ((await stat(file)).isDirectory())
        file = path.join(file, "index.html");
      const bytes = await readFile(file);
      response.writeHead(200, {
        "Content-Type": mime[path.extname(file)] || "application/octet-stream",
      });
      response.end(bytes);
    } catch {
      response.writeHead(404);
      response.end("Not found");
    }
  });
  await new Promise((resolve) => server.listen(port, "127.0.0.1", resolve));
  return {
    server,
    url: `http://127.0.0.1:${server.address().port}/bubbas-ui/`,
  };
}
if (import.meta.url === pathToFileURL(process.argv[1] || "").href) {
  const { url } = await serveDocs(Number(process.argv[2] || 4313));
  console.log(`Docs preview: ${url}`);
}
