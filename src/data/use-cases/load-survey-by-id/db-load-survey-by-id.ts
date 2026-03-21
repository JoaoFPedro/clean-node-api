import { LoadSurveyById } from "@/domain/use-cases/survey/load-survey-by-id";

import { SurveyResultModel } from "@/domain/models/survey-result";
import { LoadSurveyByIdRepository } from "@/data/protocols/db/survey/load-survey-repository-by-id ";
import { SurveyModel } from "../load-surveys/db-load-surveys-protocols";

export class DbLoadSurveyById implements LoadSurveyById {
  constructor(
    private readonly loadSurveyByIdRepository: LoadSurveyByIdRepository,
  ) {}
  async load(id: string): Promise<SurveyModel> {
    const surveyData = await this.loadSurveyByIdRepository.loadById(id);
    return surveyData;
  }
}
