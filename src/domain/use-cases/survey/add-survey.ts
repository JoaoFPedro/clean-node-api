import { SurveyModel } from "../../models/load-survey-model";

export type AddSurveyParams = Omit<SurveyModel, "id">;

export interface AddSurvey {
  add(data: AddSurveyParams): Promise<void>;
}
