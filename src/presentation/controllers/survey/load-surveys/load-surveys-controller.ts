import { LoadSurveys } from "../../../../domain/use-cases/survey/load-surveys";
import {
  noContent,
  serverError,
  success,
} from "../../../helpers/http/http-helper";
import { Controller, HttpRequest, HttpResponse } from "../../../protocols";

export class LoadSurveysController implements Controller {
  constructor(private readonly loadSurveys: LoadSurveys) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const surveys = await this.loadSurveys.load();

      return surveys.length ? success(surveys) : noContent();
    } catch (error) {
      return serverError(error as Error);
    }
  }
}
