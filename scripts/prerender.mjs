import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { render } from "../dist/server/entry-server.js";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(dirname, "..");
const clientRoot = path.join(root, "dist", "client");
const template = await fs.readFile(path.join(clientRoot, "index.html"), "utf8");

const routes = [
  "/",
  "/solutions/production-control/",
  "/solutions/order-1c-automation/",
  "/products/sales-intelligence/",
  "/solutions/bitrix24-business-result/",
  "/privacy/",
  "/404/",
];

for (const route of routes) {
  const rendered = render(route === "/404/" ? "/definitely-not-found" : route);
  const html = template
    .replace("<!--head-meta-->", rendered.head)
    .replace("<!--app-html-->", rendered.html)
    .replace("<html lang=\"ru\">", "<html lang=\"ru\" data-prerendered=\"true\">");
  const targetDir = route === "/" ? clientRoot : path.join(clientRoot, route.replace(/^\/+|\/+$/g, ""));
  await fs.mkdir(targetDir, { recursive: true });
  await fs.writeFile(path.join(targetDir, "index.html"), html, "utf8");
}

await fs.rm(path.join(root, "dist", "server"), { recursive: true, force: true });
console.info(`Prerendered ${routes.length} routes.`);
