import { SurveyResultModel } from "@/domain/models/survey-result";
import { SaveSurveyResultRepository } from "../protocols/db/save-survey-result/save-survey-result-repository";
import { SaveSurveyResultParams } from "@/domain/use-cases/surve-result/save-survey-result";
import { makeFakeSaveSurveyResult } from "@/domain/test/mock-survey-result";

export const mockSaveSurveyResultRepository = () => {
  class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
    save(account: SaveSurveyResultParams): Promise<SurveyResultModel> {
      return new Promise((resolve) => resolve(makeFakeSaveSurveyResult));
    }
  }
  return new SaveSurveyResultRepositoryStub();
};
