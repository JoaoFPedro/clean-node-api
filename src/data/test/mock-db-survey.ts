import { AddSurveyParams } from "@/domain/use-cases/survey/add-survey";
import { AddSurveyRepository } from "@/data/protocols/db/survey/add-survey-repository";
import { LoadSurveyByIdRepository } from "../protocols/db/survey/load-survey-repository-by-id ";
import { SurveyModel } from "@/domain/models/load-survey-model";
import { mockFakeSurveyById, mockFakeSurveys } from "./test-helper";
import { LoadSurveysRepository } from "../protocols/db/survey/load-surveys-repository";

export const mockAddSurveyRepository = () => {
  class AddSurveyRepositoryStub implements AddSurveyRepository {
    add(account: AddSurveyParams): Promise<void> {
      return new Promise((resolve) => resolve());
    }
  }
  return new AddSurveyRepositoryStub();
};

export const mockLoadSurveyByIdRepository = () => {
  class LoadSurveyByIdRepositoryStub implements LoadSurveyByIdRepository {
    loadById(id: string): Promise<SurveyModel> {
      return new Promise((resolve) => resolve(mockFakeSurveyById()));
    }
  }
  return new LoadSurveyByIdRepositoryStub();
};

export const mockLoadSurveysRepository = () => {
  class LoadSurveysRepositoryStub implements LoadSurveysRepository {
    loadSurveys(): Promise<SurveyModel[]> {
      return new Promise((resolve) => resolve(mockFakeSurveys()));
    }
  }
  return new LoadSurveysRepositoryStub();
};
