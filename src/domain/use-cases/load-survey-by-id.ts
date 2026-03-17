import { SurveyModel } from "../models/load-survey-model";

export interface LoadSurveyById {
  load(id: string): Promise<SurveyModel | null>;
}
