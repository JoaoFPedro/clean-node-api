import { Controller } from "@/presentation/protocols";
import { makeLogControllerDecorator } from "../../../decoratos/log-controller-decotaror-factory";
import { SaveSurveyResultController } from "@/presentation/controllers/survey/survey-result/save-survey-result/save-survey-result";
import { makeDbSaveSurveyResult } from "@/main/factories/usecases/survey/save-survey-result/db-save-survey-result";
import { makeDbLoadByIdSurvey } from "@/main/factories/usecases/survey/load-survey/db-load-survey-by-id";

export const makeSaveSurveyResultController = (): Controller => {
  const controller = new SaveSurveyResultController(
    makeDbLoadByIdSurvey(),
    makeDbSaveSurveyResult(),
  );
  return makeLogControllerDecorator(controller);
};
