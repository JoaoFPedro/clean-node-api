import express, { Express } from "express";
import setUpMiddlewares from "./middlewares";
import setUpRoutes from "./routes";

export const setupApp = async (): Promise<Express> => {
  const app = express();
  setUpMiddlewares(app);
  await setUpRoutes(app);
  return app;
};
