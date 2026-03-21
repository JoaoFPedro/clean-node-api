import { SurveyModel } from "../../models/load-survey-model";

export type AddSurveyModel = Omit<SurveyModel, "id">;

export interface AddSurvey {
  add(data: AddSurveyModel): Promise<void>;
}
