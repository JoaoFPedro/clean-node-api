import { DbAddSurvey } from "../add-survey/db-add-survey";
import {
  AddSurveyParams,
  AddSurveyRepository,
} from "./db-add-survey-protocols";
import MockDate from "mockdate";

const makeFakeAddSurvey = (): AddSurveyParams => ({
  question: "any_question",
  answers: [
    {
      image: "any_image",
      answer: "any_answer",
    },
  ],
  date: new Date(),
});
const makeAddSurveyRepository = () => {
  class AddSurveyRepositoryStub implements AddSurveyRepository {
    add(account: AddSurveyParams): Promise<void> {
      return new Promise((resolve) => resolve());
    }
  }
  return new AddSurveyRepositoryStub();
};
const makeSut = (): any => {
  const addSurveyRepositoryStub = makeAddSurveyRepository();

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
    const surveyData = makeFakeAddSurvey();
    sut.add(surveyData);

    expect(jestSpy).toHaveBeenLastCalledWith(surveyData);
  });

  test("Should throw if AddSurveyRepository throws", async () => {
    const { sut, addSurveyRepositoryStub } = makeSut();
    jest
      .spyOn(addSurveyRepositoryStub, "add")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error())),
      );

    const promise = sut.add(makeFakeAddSurvey());
    await expect(promise).rejects.toThrow();
  });
});
