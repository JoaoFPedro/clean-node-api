import MockDate from "mockdate";
import { DbSaveSurveyResult } from "./db-save-survey-result";
import { throwError } from "@/domain/test/test-helper";
import { mockSaveSurveyResultRepository } from "@/data/test/mock-db-save-survey-result";
import {
  makeFakeSaveSurveyResult,
  mockFakeSaveSurveyResultData,
} from "@/domain/test/mock-survey-result";

const makeSut = (): any => {
  const saveSurveyResultRepositoryStub = mockSaveSurveyResultRepository();

  const sut = new DbSaveSurveyResult(saveSurveyResultRepositoryStub);

  return {
    sut,
    saveSurveyResultRepositoryStub,
  };
};
describe("DbSaveSurveyResult Use case", () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });
  test("Should call SaveSurveyResultRepository with correct values", async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut();
    const jestSpy = jest.spyOn(saveSurveyResultRepositoryStub, "save");
    const surveyResultData = mockFakeSaveSurveyResultData();
    sut.save(surveyResultData);

    expect(jestSpy).toHaveBeenLastCalledWith(surveyResultData);
  });
  test("Should throw if SaveSurveyResultRepository throws", async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut();
    jest
      .spyOn(saveSurveyResultRepositoryStub, "save")
      .mockImplementationOnce(() => throwError());

    const promise = sut.save(mockFakeSaveSurveyResultData());
    await expect(promise).rejects.toThrow();
  });
  test("Should return SurveyResult on success", async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.save(mockFakeSaveSurveyResultData());

    expect(httpResponse).toEqual(makeFakeSaveSurveyResult);
  });
});
