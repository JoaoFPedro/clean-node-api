import { Controller } from "../../../../presentation/protocols";
import { makeAddSurveyValidation } from "./add-survey-validation";

import { makeLogControllerDecorator } from "../../decoratos/log-controller-decotaror-factory";
import { AddSurveyController } from "../../../../presentation/controllers/survey/add-survey/add-survey-controler";
import { makeDbAddSurvey } from "../../usecases/add-survey/db-add-survey";

export const makeAddSurveyController = (): Controller => {
  const controller = new AddSurveyController(
    makeAddSurveyValidation(),
    makeDbAddSurvey(),
  );
  return makeLogControllerDecorator(controller);
};
