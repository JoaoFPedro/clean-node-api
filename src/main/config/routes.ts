import { Express, Router } from "express";
import fg from "fast-glob";
import { readdirSync } from "fs";

export default (app: Express): void => {
  const router = Router();
  app.use("/api", router);
  // fg.sync("**/dist/main/routes/**routes.js").map(async (file) =>
  //   (await import(`../../../${file}`)).default(router)
  // );
  readdirSync(`${__dirname}/../routes`).map(async (file) => {
    if (!file.includes(".test.")) {
      (await import(`../routes/${file}`)).default(router);
    }
  });
};
