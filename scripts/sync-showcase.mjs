import { cp, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
for (const app of ["next", "expo"]) {
  const target = path.join(root, "examples", app, "showcase");
  await mkdir(target, { recursive: true });
  await cp(path.join(root, "apps/docs/src/showcase"), target, {
    recursive: true,
  });
}
console.log(
  "Copied the canonical universal catalog and gallery into both self-contained examples.",
);
