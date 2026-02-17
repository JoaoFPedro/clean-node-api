import { Router } from "express";
import { adaptRoute } from "../../adapters/express-route-adapter";
import { makeSingUpController } from "../../factories/controllers/login/signup/signup-factory";
import { makeLoginController } from "../../factories/controllers/login/login/login-factory";

export default (router: Router): void => {
  router.post("/signup", adaptRoute(makeSingUpController()));
  router.post("/login", adaptRoute(makeLoginController()));
};
