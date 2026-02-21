import { SurveyModel } from "../models/load-survey-model";

export interface LoadSurveys {
  load(): Promise<SurveyModel[]>;
}
