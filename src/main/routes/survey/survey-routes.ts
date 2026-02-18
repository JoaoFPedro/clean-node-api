import { Router } from "express";
import { adaptRoute } from "../../adapters/express-route-adapter";
import { makeAddSurveyController } from "../../factories/survey/add-survey/add-survey-factory";
import { adaptMiddleware } from "../../adapters/express-middlawere-adapter";
import { makeAuthMiddleware } from "../../factories/middlewares/auth-middleware-factory";

export default (router: Router): void => {
  const adminAuth = adaptMiddleware(makeAuthMiddleware("admin"));
  router.post("/surveys", adminAuth, adaptRoute(makeAddSurveyController()));
};
