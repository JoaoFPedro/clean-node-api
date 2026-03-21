import { LoadSurveyByIdRepository } from "@/data/protocols/db/survey/load-survey-repository-by-id ";
import { LoadSurveyById } from "@/domain/use-cases/survey/load-survey-by-id";
import MockDate from "mockdate";
import { DbLoadSurveyById } from "./db-load-survey-by-id";
import { SurveyModel } from "../load-surveys/db-load-surveys-protocols";

const makeLoadSurveyByIdRepository = () => {
  class LoadSurveyByIdRepositoryStub implements LoadSurveyByIdRepository {
    loadById(id: string): Promise<SurveyModel> {
      return new Promise((resolve) => resolve(makeFakeSurveyById()));
    }
  }
  return new LoadSurveyByIdRepositoryStub();
};
const makeFakeSurveyById = (): SurveyModel => {
  return {
    id: "any_id",
    question: "any_question",
    answers: [
      {
        image: "any_image",
        answer: "any_answer",
      },
    ],

    date: new Date(),
  };
};
type SutTypes = {
  sut: LoadSurveyById;
  loadSurveyByIdRepositoryStub: LoadSurveyByIdRepository;
};
const makeSut = (): SutTypes => {
  const loadSurveyByIdRepositoryStub = makeLoadSurveyByIdRepository();
  const sut = new DbLoadSurveyById(loadSurveyByIdRepositoryStub);

  return {
    sut,
    loadSurveyByIdRepositoryStub,
  };
};

describe("Load-survey-by-id Controller", () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });
  test("Should call LoadSurveyByIdRepository with correct id", async () => {
    const { sut, loadSurveyByIdRepositoryStub } = makeSut();
    const jestSpy = jest.spyOn(loadSurveyByIdRepositoryStub, "loadById");
    await sut.load("any_id");
    expect(jestSpy).toHaveBeenCalledWith("any_id");
  });
  test("Should return one survey", async () => {
    const { sut, loadSurveyByIdRepositoryStub } = makeSut();

    jest.spyOn(loadSurveyByIdRepositoryStub, "loadById");
    const surveyData = await sut.load("any_id");
    expect(surveyData).toEqual(makeFakeSurveyById());
  });
  test("Should return 500 if loadSurveyByIdRepository throws", async () => {
    const { sut, loadSurveyByIdRepositoryStub } = makeSut();
    jest
      .spyOn(loadSurveyByIdRepositoryStub, "loadById")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error())),
      );
    const httpResponse = sut.load("any_id");
    await expect(httpResponse).rejects.toThrow();
  });
});
