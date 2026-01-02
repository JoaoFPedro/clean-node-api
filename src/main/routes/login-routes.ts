import { Router } from "express";
import { adaptRoute } from "../adapters/express-route-adapter";
import { makeSingUpController } from "../factories/signup/signup";
import { makeLoginController } from "../factories/login/login";

export default (router: Router): void => {
  router.post("/signup", adaptRoute(makeSingUpController()));
  router.post("/login", adaptRoute(makeLoginController()));
};
