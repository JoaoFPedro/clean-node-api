import { DbLoadSurveys } from "./db-load-survey";
import {
  LoadSurveys,
  LoadSurveysRepository,
  SurveyModel,
} from "./db-load-surveys-protocols";
import MockDate from "mockdate";

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
const makeLoadSurveysRepository = () => {
  class LoadSurveysRepositoryStub implements LoadSurveysRepository {
    loadSurveys(): Promise<SurveyModel[]> {
      return new Promise((resolve) => resolve(makeFakeSurveys()));
    }
  }
  return new LoadSurveysRepositoryStub();
};

type SutTypes = {
  sut: LoadSurveys;
  loadSurveysRepositoryStub: LoadSurveysRepository;
};
const makeSut = (): SutTypes => {
  const loadSurveysRepositoryStub = makeLoadSurveysRepository();
  const sut = new DbLoadSurveys(loadSurveysRepositoryStub);

  return {
    sut,
    loadSurveysRepositoryStub,
  };
};
describe("Load-surveys Controller", () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });
  test("Should call LoadSurveysRepository", async () => {
    const { sut, loadSurveysRepositoryStub } = makeSut();
    const jestSpy = jest.spyOn(loadSurveysRepositoryStub, "loadSurveys");
    await sut.load();
    expect(jestSpy).toHaveBeenCalled();
  });
  test("Should return a list of surveys", async () => {
    class LoadSurveysRepositoryStub implements LoadSurveysRepository {
      loadSurveys(): Promise<SurveyModel[]> {
        return new Promise((resolve) => resolve(makeFakeSurveys()));
      }
    }
    const loadSurveyRepositoryStub = new LoadSurveysRepositoryStub();
    const sut = new DbLoadSurveys(loadSurveyRepositoryStub);
    jest.spyOn(loadSurveyRepositoryStub, "loadSurveys");
    const surveysData = await sut.load();
    expect(surveysData).toEqual(makeFakeSurveys());
  });
  test("Should return 500 if loadSurveysRepository throws", async () => {
    const { sut, loadSurveysRepositoryStub } = makeSut();
    jest
      .spyOn(loadSurveysRepositoryStub, "loadSurveys")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error())),
      );
    const httpResponse = sut.load();
    await expect(httpResponse).rejects.toThrow();
  });
});
