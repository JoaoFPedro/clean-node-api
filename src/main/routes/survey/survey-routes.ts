import { Router } from "express";
import { adaptRoute } from "../../adapters/express-route-adapter";
import { makeAddSurveyController } from "../../factories/controllers/survey/add-survey/add-survey-factory";
import { makeLoadSurveyController } from "../../factories/controllers/survey/load-survey/load-survey-factory";
import { adminAuth, admin } from "../../middlewares/";

export default (router: Router): void => {
  router.post("/surveys", adminAuth, adaptRoute(makeAddSurveyController()));
  router.get("/surveys", admin, adaptRoute(makeLoadSurveyController()));
};
