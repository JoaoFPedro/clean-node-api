import {
  AddSurvey,
  SaveSurveyResultParams,
} from "@/domain/use-cases/surve-result/save-survey-result";
import { LoadSurveyById } from "@/domain/use-cases/survey/load-survey-by-id";
import { InvalidParamError } from "@/presentation/erros";
import {
  forbidden,
  serverError,
  success,
} from "@/presentation/helpers/http/http-helper";
import {
  Controller,
  HttpRequest,
  HttpResponse,
} from "@/presentation/protocols";

export class SaveSurveyResultController implements Controller {
  constructor(
    private readonly loadSurveyById: LoadSurveyById,
    private readonly saveSurveyResult: AddSurvey,
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const surveyResult = await this.loadSurveyById.load(
        httpRequest.params.surveyId,
      );
      if (!surveyResult) {
        return forbidden(new Error("Invalid surveyId"));
      }
      if (
        !surveyResult.answers.find((a) => a.answer === httpRequest.body.answer)
      ) {
        return forbidden(new InvalidParamError("answer"));
      }
      const savedSurveyResult = await this.saveSurveyResult.save({
        surveyId: httpRequest.params.surveyId,
        answer: httpRequest.body.answer,
        accountId: httpRequest.accountId!,
        date: new Date(),
      });
      return success(savedSurveyResult);
    } catch (error) {
      return serverError(error as Error);
    }
  }
}
