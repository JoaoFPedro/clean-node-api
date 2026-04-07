import { throwError } from "@/domain/test/test-helper";
import { DbLoadSurveys } from "./db-load-survey";
import {
  LoadSurveys,
  LoadSurveysRepository,
  SurveyModel,
} from "./db-load-surveys-protocols";
import MockDate from "mockdate";
import { mockLoadSurveysRepository } from "@/data/test/mock-db-survey";
import { mockFakeSurveys } from "@/data/test/test-helper";

type SutTypes = {
  sut: LoadSurveys;
  loadSurveysRepositoryStub: LoadSurveysRepository;
};
const makeSut = (): SutTypes => {
  const loadSurveysRepositoryStub = mockLoadSurveysRepository();
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
        return new Promise((resolve) => resolve(mockFakeSurveys()));
      }
    }
    const loadSurveyRepositoryStub = new LoadSurveysRepositoryStub();
    const sut = new DbLoadSurveys(loadSurveyRepositoryStub);
    jest.spyOn(loadSurveyRepositoryStub, "loadSurveys");
    const surveysData = await sut.load();
    expect(surveysData).toEqual(mockFakeSurveys());
  });
  test("Should return 500 if loadSurveysRepository throws", async () => {
    const { sut, loadSurveysRepositoryStub } = makeSut();
    jest
      .spyOn(loadSurveysRepositoryStub, "loadSurveys")
      .mockImplementationOnce(() => throwError());
    const httpResponse = sut.load();
    await expect(httpResponse).rejects.toThrow();
  });
});
