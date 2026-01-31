import { Router } from "express";
import { adaptRoute } from "../../../infra/adapters/express-route-adapter";
import { makeAddSurveyController } from "../../factories/controllers/add-survey/add-survey-factory";

export default (router: Router): void => {
  router.post("/surveys", adaptRoute(makeAddSurveyController()));
};
