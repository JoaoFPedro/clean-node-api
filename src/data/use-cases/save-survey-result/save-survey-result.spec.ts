import { SaveSurveyResultRepository } from "@/data/protocols/db/save-survey-result/save-survey-result-repository";
import { SurveyResultModel } from "@/domain/models/survey-result";
import { SaveSurveyResultModel } from "@/domain/use-cases/surve-result/save-survey-result";

import MockDate from "mockdate";
import { DbSaveSurveyResult } from "./db-save-survey-result";

const makeFakeSaveSurveyResultData = (): SaveSurveyResultModel => ({
  accountId: "any_account_id",
  surveyId: "any_survey_id",
  answer: "any_answer",
  date: new Date(),
});
const makeFakeSaveSurveyResult = Object.assign(
  {},
  makeFakeSaveSurveyResultData(),
  { id: "any_id" },
);
const makeSaveSurveyResultRepository = () => {
  class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
    save(account: SaveSurveyResultModel): Promise<SurveyResultModel> {
      return new Promise((resolve) => resolve(makeFakeSaveSurveyResult));
    }
  }
  return new SaveSurveyResultRepositoryStub();
};
const makeSut = (): any => {
  const saveSurveyResultRepositoryStub = makeSaveSurveyResultRepository();

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
    const surveyResultData = makeFakeSaveSurveyResultData();
    sut.save(surveyResultData);

    expect(jestSpy).toHaveBeenLastCalledWith(surveyResultData);
  });
  test("Should throw if SaveSurveyResultRepository throws", async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut();
    jest
      .spyOn(saveSurveyResultRepositoryStub, "save")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error())),
      );

    const promise = sut.save(makeFakeSaveSurveyResultData());
    await expect(promise).rejects.toThrow();
  });
  test("Should return SurveyResult on success", async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.save(makeFakeSaveSurveyResultData());

    expect(httpResponse).toEqual(makeFakeSaveSurveyResult);
  });
});
