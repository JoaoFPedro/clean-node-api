import express, { Express } from "express";
import setUpMiddlewares from "./middlewares";
import setUpRoutes from "./routes";
import setUpSwagger from "./config-swagger";

export const setupApp = async (): Promise<Express> => {
  const app = express();
  setUpSwagger(app);
  setUpMiddlewares(app);
  await setUpRoutes(app);
  return app;
};
