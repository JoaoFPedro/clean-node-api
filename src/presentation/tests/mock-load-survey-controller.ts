import {
  LoadSurveys,
  SurveyModel,
} from "@/data/use-cases/load-surveys/db-load-surveys-protocols";
import { mockFakeSurveys } from "./test-helper";

export const mockLoadSurveys = (): LoadSurveys => {
  class LoadSurveysStub implements LoadSurveys {
    async load(): Promise<SurveyModel[]> {
      return new Promise((resolve) => resolve(mockFakeSurveys()));
    }
  }
  return new LoadSurveysStub();
};
