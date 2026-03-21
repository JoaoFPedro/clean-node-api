import { SurveyModel } from "@/domain/models/load-survey-model";
import { SurveyResultModel } from "@/domain/models/survey-result";

export interface LoadSurveyByIdRepository {
  loadById(id: string): Promise<SurveyModel>;
}
