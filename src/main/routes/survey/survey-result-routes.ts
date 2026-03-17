import { Router } from "express";
import { adaptRoute } from "../../adapters/express-route-adapter";

import { adminAuth, admin } from "../../middlewares";
import { makeSaveSurveyResultController } from "@/main/factories/controllers/survey/save-survey-result/save-survey-result-factory";

export default (router: Router): void => {
  router.put(
    "/surveys/:surveyId/results",
    adminAuth,
    adaptRoute(makeSaveSurveyResultController()),
  );
};
