import { Router } from "express";
import { adaptRoute } from "../../infra/adapters/express-route-adapter";
import { makeSingUpController } from "../factories/controllers/signup/signup-factory";
import { makeLoginController } from "../factories/controllers/login/login-factory";

export default (router: Router): void => {
  router.post("/signup", adaptRoute(makeSingUpController()));
  router.post("/login", adaptRoute(makeLoginController()));
};
