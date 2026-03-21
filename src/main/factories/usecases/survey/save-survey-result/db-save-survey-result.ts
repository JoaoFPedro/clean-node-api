import { DbSaveSurveyResult } from "@/data/use-cases/save-survey-result/db-save-survey-result";
import { AddSurvey } from "@/domain/use-cases/surve-result/save-survey-result";
import { SurveyResultMongoRepository } from "@/infra/db/mongodb/survey-result/save-survey-result";

export const makeDbSaveSurveyResult = (): AddSurvey => {
  const surveyResultMongoRepository = new SurveyResultMongoRepository();

  return new DbSaveSurveyResult(surveyResultMongoRepository);
};
