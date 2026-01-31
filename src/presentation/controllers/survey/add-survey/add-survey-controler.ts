import { AddSurvey } from "../../../../domain/use-cases/add-survey";
import {
  badRequest,
  noContent,
  serverError,
} from "../../../helpers/http/http-helper";
import { Controller, HttpRequest, HttpResponse } from "../../../protocols";
import { Validation } from "../../../protocols/validation";

export class AddSurveyController implements Controller {
  private readonly validation: Validation;
  private readonly addSurvey: AddSurvey;
  constructor(validation: Validation, addSurvey: AddSurvey) {
    this.validation = validation;
    this.addSurvey = addSurvey;
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = await this.validation.validate(httpRequest.body);

      if (error) {
        return badRequest(new Error());
      }
      const { question, answers } = httpRequest.body;
      await this.addSurvey.add({
        question,
        answers,
      });
      return noContent();
    } catch (error) {
      return serverError(error as Error);
    }
  }
}
