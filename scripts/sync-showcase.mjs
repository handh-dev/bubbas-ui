import { cp, mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
for (const app of ["next", "expo"]) {
  const target = path.join(root, "examples", app, "showcase");
  await mkdir(target, { recursive: true });
  await cp(path.join(root, "apps/docs/src/showcase"), target, {
    recursive: true,
  });
  if (app === 'next') for (const name of await readdir(target)) {
    const file = path.join(target, name);
    if (/\.[jt]sx?$/.test(name)) await writeFile(file, (await readFile(file, 'utf8')).replaceAll('"@bubbasfw/ui"', '"@bubbasfw/ui/web"'));
  }
}
console.log(
  "Copied the canonical universal catalog and gallery into both self-contained examples.",
);
