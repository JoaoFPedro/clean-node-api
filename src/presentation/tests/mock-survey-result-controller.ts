import { SurveyModel } from "@/data/use-cases/load-surveys/db-load-surveys-protocols";
import { LoadSurveyById } from "@/domain/use-cases/survey/load-survey-by-id";
import { mockFakeSurvey, mockFakeSurveyResult } from "./test-helper";
import {
  AddSurvey,
  SaveSurveyResultParams,
} from "@/domain/use-cases/surve-result/save-survey-result";

export const mockFakeLoadSurveyById = (): LoadSurveyById => {
  class LoadSurveyByIdStub implements LoadSurveyById {
    async load(id: string): Promise<SurveyModel> {
      return new Promise((resolve) => resolve(mockFakeSurvey()));
    }
  }
  return new LoadSurveyByIdStub();
};
export const mockFakeSaveSurveyResult = (): AddSurvey => {
  class SaveSurveyResultStub implements AddSurvey {
    async save(data: SaveSurveyResultParams): Promise<SaveSurveyResultParams> {
      return new Promise((resolve) => resolve(mockFakeSurveyResult()));
    }
  }
  return new SaveSurveyResultStub();
};
