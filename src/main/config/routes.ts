import { Express, Router } from "express";
import fg from "fast-glob";
import { readdirSync } from "fs";

export default async (app: Express): Promise<void> => {
  const router = Router();
  app.use("/api", router);
  const routeFiles = fg.sync("**/*-routes.{ts,js}", {
    cwd: `${__dirname}/../routes`,
    absolute: false,
  });

  for (const file of routeFiles) {
    (await import(`../routes/${file}`)).default(router);
  }
};
