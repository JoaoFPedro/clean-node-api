import { AddSurveyParams } from "@/domain/use-cases/survey/add-survey";

export interface AddSurveyRepository {
  add(account: AddSurveyParams): Promise<void>;
}
