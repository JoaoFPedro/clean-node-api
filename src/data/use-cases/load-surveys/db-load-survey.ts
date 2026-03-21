import { SurveyModel } from "../../../domain/models/load-survey-model";
import { LoadSurveys } from "../../../domain/use-cases/survey/load-surveys";
import { LoadSurveysRepository } from "../../protocols/db/survey/load-surveys-repository";

export class DbLoadSurveys implements LoadSurveys {
  constructor(private readonly loadSurveyRepository: LoadSurveysRepository) {}
  async load(): Promise<SurveyModel[]> {
    const surveysData = await this.loadSurveyRepository.loadSurveys();
    return surveysData;
  }
}
