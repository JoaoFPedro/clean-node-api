import { SaveSurveyResultRepository } from "@/data/protocols/db/save-survey-result/save-survey-result-repository";

import { SurveyResultModel } from "@/domain/models/survey-result";

export class DbSaveSurveyResult implements SaveSurveyResultRepository {
  constructor(
    private readonly saveSurveyResultRepository: SaveSurveyResultRepository,
  ) {}
  async save(data: SurveyResultModel): Promise<SurveyResultModel> {
    const surveyResult = await this.saveSurveyResultRepository.save(data);
    return surveyResult;
  }
}
