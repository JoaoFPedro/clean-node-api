import { SurveyModel } from "@/domain/models/load-survey-model";

export interface LoadSurveysRepository {
  loadSurveys(): Promise<SurveyModel[]>;
}
