import { LoadSurveysController } from "../load-surveys/load-surveys-controller";
import { LoadSurveys } from "../../../../domain/use-cases/survey/load-surveys";
import { SurveyModel } from "../../../../domain/models/load-survey-model";
import MockDate from "mockdate";
import {
  noContent,
  serverError,
  success,
} from "../../../helpers/http/http-helper";
import { throwError } from "@/domain/test/test-helper";
import { mockFakeSurveys } from "@/presentation/tests/test-helper";
import { mockLoadSurveys } from "@/presentation/tests/mock-load-survey-controller";

type SutTypes = {
  sut: LoadSurveysController;
  loadSurveysStub: LoadSurveys;
};
const makeSut = (): SutTypes => {
  const loadSurveysStub = mockLoadSurveys();
  const sut = new LoadSurveysController(loadSurveysStub);

  return {
    sut,
    loadSurveysStub,
  };
};
describe("Load-surveys Controller", () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });
  test("Should call LoadSurveys", async () => {
    const { sut, loadSurveysStub } = makeSut();

    const jestSpy = jest.spyOn(loadSurveysStub, "load");
    sut.handle({});

    expect(jestSpy).toHaveBeenCalled();
  });
  test("Should return 200 on success", async () => {
    const { sut, loadSurveysStub } = makeSut();

    jest.spyOn(loadSurveysStub, "load");
    const httpResponse = await sut.handle({});

    expect(httpResponse).toEqual(success(mockFakeSurveys()));
  });
  test("Should return 500 if LoadSurveys throws", async () => {
    const { sut, loadSurveysStub } = makeSut();
    jest
      .spyOn(loadSurveysStub, "load")
      .mockImplementationOnce(() => throwError());
    const httpResponse = await sut.handle({});

    expect(httpResponse).toEqual(serverError(new Error()));
  });
  test("Should return 204 if LoadSurveys returns empty", async () => {
    const { sut, loadSurveysStub } = makeSut();
    jest
      .spyOn(loadSurveysStub, "load")
      .mockReturnValueOnce(new Promise((resolve) => resolve([])));
    const httpResponse = await sut.handle({});

    expect(httpResponse).toEqual(noContent());
  });
});
