import { LoadSurveysController } from "../load-surveys/load-surveys-controller";
import { LoadSurveys } from "../../../../domain/use-cases/load-surveys";
import { SurveyModel } from "../../../../domain/models/load-survey-model";
import MockDate from "mockdate";
import {
  noContent,
  serverError,
  success,
} from "../../../helpers/http/http-helper";

const makeFakeSurveys = (): SurveyModel[] => {
  return [
    {
      id: "any_id",
      question: "any_question",
      answers: [
        {
          image: "any_image",
          answer: "any_answer",
        },
      ],
      date: new Date(),
    },
    {
      id: "other_id",
      question: "other_id_question",
      answers: [
        {
          image: "other_id_image",
          answer: "other_id_answer",
        },
      ],
      date: new Date(),
    },
  ];
};
const makeFakeLoadSurveys = (): LoadSurveys => {
  class LoadSurveysStub implements LoadSurveys {
    async load(): Promise<SurveyModel[]> {
      return new Promise((resolve) => resolve(makeFakeSurveys()));
    }
  }
  return new LoadSurveysStub();
};
type SutTypes = {
  sut: LoadSurveysController;
  loadSurveysStub: LoadSurveys;
};
const makeSut = (): SutTypes => {
  const loadSurveysStub = makeFakeLoadSurveys();
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

    expect(httpResponse).toEqual(success(makeFakeSurveys()));
  });
  test("Should return 500 if LoadSurveys throws", async () => {
    const { sut, loadSurveysStub } = makeSut();
    jest
      .spyOn(loadSurveysStub, "load")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error())),
      );
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
