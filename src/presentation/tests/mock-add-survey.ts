import {
  AddSurvey,
  AddSurveyParams,
} from "@/data/use-cases/add-survey/db-add-survey-protocols";

export const mockAddSurvey = () => {
  class AddSurveyStub implements AddSurvey {
    async add(data: AddSurveyParams): Promise<void> {
      return new Promise((resolve) => resolve());
    }
  }
  return new AddSurveyStub();
};
