import { SaveSurveyResultParams } from "@/domain/use-cases/surve-result/save-survey-result";
import { mockAddAccountParams } from "./mock-account";
import { Collection } from "mongodb";

export const mockFakeSaveSurveyResultData = (): SaveSurveyResultParams => ({
  accountId: "any_account_id",
  surveyId: "any_survey_id",
  answer: "any_answer",
  date: new Date(),
});

export const makeFakeSaveSurveyResult = Object.assign(
  {},
  mockFakeSaveSurveyResultData(),
  { id: "any_id" },
);
