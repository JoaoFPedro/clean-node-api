import { SaveSurveyResultController } from "./save-survey-result";
import { SurveyModel } from "@/domain/models/load-survey-model";
import { HttpRequest } from "@/presentation/protocols";
import { LoadSurveyById } from "@/domain/use-cases/survey/load-survey-by-id";
import {
  forbidden,
  serverError,
  success,
} from "@/presentation/helpers/http/http-helper";
import { InvalidParamError } from "@/presentation/erros";
import {
  AddSurvey,
  SaveSurveyResultParams,
} from "@/domain/use-cases/surve-result/save-survey-result";
import { SurveyResultModel } from "@/domain/models/survey-result";
import MockDate from "mockdate";

const makeFakeSurvey = (): SurveyModel => ({
  id: "any_id",
  question: "any_question",
  answers: [
    {
      image: "any_image",
      answer: "any_answer",
    },
  ],
  date: new Date(),
});
const makeFakeSurveyResult = (): SurveyResultModel => ({
  surveyId: "any_id",
  answer: "any_answer",
  accountId: "any_account_id",
  date: new Date(),
  id: "any_id",
});
const makeFakeRequest = (): HttpRequest => ({
  params: {
    surveyId: "any_id",
  },
  body: {
    answer: "any_answer",
  },
  accountId: "any_account_id",
});
const makeFakeLoadSurveyById = (): LoadSurveyById => {
  class LoadSurveyByIdStub implements LoadSurveyById {
    async load(id: string): Promise<SurveyModel> {
      return new Promise((resolve) => resolve(makeFakeSurvey()));
    }
  }
  return new LoadSurveyByIdStub();
};
const makeSaveSurveyResult = (): AddSurvey => {
  class SaveSurveyResultStub implements AddSurvey {
    async save(data: SaveSurveyResultParams): Promise<SaveSurveyResultParams> {
      return new Promise((resolve) => resolve(makeFakeSurveyResult()));
    }
  }
  return new SaveSurveyResultStub();
};
type SutTypes = {
  sut: SaveSurveyResultController;
  loadSurveyByIdStub: LoadSurveyById;
  saveSurveyResultStub: AddSurvey;
};
const makeSut = (): SutTypes => {
  const loadSurveyByIdStub = makeFakeLoadSurveyById();
  const saveSurveyResultStub = makeSaveSurveyResult();
  const sut = new SaveSurveyResultController(
    loadSurveyByIdStub,
    saveSurveyResultStub,
  );

  return {
    sut,
    loadSurveyByIdStub,
    saveSurveyResultStub,
  };
};
describe("SaveSurveyResult Controller", () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });

  test("Should call LoadSurveyById with correct values", async () => {
    const { sut, loadSurveyByIdStub } = makeSut();

    const jestSpy = jest.spyOn(loadSurveyByIdStub, "load");

    await sut.handle(makeFakeRequest());

    expect(jestSpy).toHaveBeenCalledWith("any_id");
  });
  test("Should return 403 if LoadSurveyById returns null", async () => {
    const { sut, loadSurveyByIdStub } = makeSut();

    const jestSpy = jest
      .spyOn(loadSurveyByIdStub, "load")
      .mockReturnValueOnce(Promise.resolve(null) as any);
    const httpResponse = await sut.handle(makeFakeRequest());

    expect(jestSpy).toHaveBeenCalledWith("any_id");
    expect(httpResponse).toEqual(forbidden(new Error("Invalid surveyId")));
  });
  test("Should return 500 if LoadSurveyById throws", async () => {
    const { sut, loadSurveyByIdStub } = makeSut();
    jest
      .spyOn(loadSurveyByIdStub, "load")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error())),
      );
    const httpResponse = await sut.handle(makeFakeRequest());

    expect(httpResponse).toEqual(serverError(new Error()));
  });
  test("Should return 403 if an invalid answer is provided", async () => {
    const { sut } = makeSut();

    const httpResponse = await sut.handle({
      body: {
        answer: "invalid_answer",
      },
      params: { surveyId: "any_id" },
    });

    expect(httpResponse).toEqual(forbidden(new InvalidParamError("answer")));
  });
  test("Should call SaveSurveyResult with correct values", async () => {
    const { sut, saveSurveyResultStub } = makeSut();

    const jestSpy = jest.spyOn(saveSurveyResultStub, "save");

    await sut.handle(makeFakeRequest());

    expect(jestSpy).toHaveBeenCalledWith({
      surveyId: "any_id",
      answer: "any_answer",
      accountId: "any_account_id",
      date: new Date(),
    });
  });
  test("Should return 500 if SaveSurveyResult throws", async () => {
    const { sut, saveSurveyResultStub } = makeSut();
    jest
      .spyOn(saveSurveyResultStub, "save")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error())),
      );
    const httpResponse = await sut.handle(makeFakeRequest());

    expect(httpResponse).toEqual(serverError(new Error()));
  });
  test("Should return 200 and data in case of success", async () => {
    const { sut } = makeSut();

    const httpResponse = await sut.handle(makeFakeRequest());

    expect(httpResponse).toEqual(success(makeFakeSurveyResult()));
  });
});
