import { Controller } from "@/presentation/protocols";
import { makeLogControllerDecorator } from "../../../decoratos/log-controller-decotaror-factory";
import { LoadSurveysController } from "@/presentation/controllers/survey/load-surveys/load-surveys-controller";
import { makeDbLoadSurvey } from "../../../usecases/survey/load-survey/db-load-surveys";

export const makeLoadSurveyController = (): Controller => {
  const controller = new LoadSurveysController(makeDbLoadSurvey());
  return makeLogControllerDecorator(controller);
};
