import { throwError } from "@/domain/test/test-helper";
import { DbAddSurvey } from "../add-survey/db-add-survey";
import MockDate from "mockdate";
import { mockAddSurveyRepository } from "@/data/test/mock-db-survey";
import { mockFakeAddSurvey } from "@/data/test/test-helper";

const makeSut = (): any => {
  const addSurveyRepositoryStub = mockAddSurveyRepository();

  const sut = new DbAddSurvey(addSurveyRepositoryStub);

  return {
    sut,
    addSurveyRepositoryStub,
  };
};
describe("DBAddSurvey Use case", () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });
  test("Should call AddSurveyRepository with correct values", async () => {
    const { sut, addSurveyRepositoryStub } = makeSut();
    const jestSpy = jest.spyOn(addSurveyRepositoryStub, "add");
    const surveyData = mockFakeAddSurvey();
    sut.add(surveyData);

    expect(jestSpy).toHaveBeenLastCalledWith(surveyData);
  });

  test("Should throw if AddSurveyRepository throws", async () => {
    const { sut, addSurveyRepositoryStub } = makeSut();
    jest
      .spyOn(addSurveyRepositoryStub, "add")
      .mockImplementationOnce(() => throwError());

    const promise = sut.add(mockFakeAddSurvey());
    await expect(promise).rejects.toThrow();
  });
});
