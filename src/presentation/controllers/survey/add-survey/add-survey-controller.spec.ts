import {
  badRequest,
  noContent,
  serverError,
} from "../../../helpers/http/http-helper";
import { HttpRequest } from "../../../protocols";
import { Validation } from "../../../protocols/validation";
import { AddSurveyController } from "./add-survey-controler";
import {
  AddSurvey,
  AddSurveyModel,
} from "../../../../domain/use-cases/add-survey";

const makeFakeRequest = (): HttpRequest => ({
  body: {
    question: "any_question",
    answers: [
      {
        image: "any_image",
        answer: "any_answer",
      },
    ],
  },
});
const makeValidation = () => {
  class ValidationStub implements Validation {
    validate(input: any): Error | null | undefined {
      return null;
    }
  }
  return new ValidationStub();
};
const makeAddSurvey = () => {
  class AddSurveyStub implements AddSurvey {
    async add(data: AddSurveyModel): Promise<void> {
      return new Promise((resolve) => resolve());
    }
  }
  return new AddSurveyStub();
};
type SutTypes = {
  sut: AddSurveyController;
  validation: Validation;
  addSurveyStub: AddSurvey;
};
const makeSut = (): SutTypes => {
  const validation = makeValidation();
  const addSurveyStub = makeAddSurvey();

  const sut = new AddSurveyController(validation, addSurveyStub);

  return {
    sut,
    validation,
    addSurveyStub,
  };
};
describe("Add-survey Controller", () => {
  test("Should call Validation with correct values", async () => {
    const { sut, validation } = makeSut();
    const jestSpy = jest.spyOn(validation, "validate");
    const httpRequest = makeFakeRequest();
    await sut.handle(httpRequest);

    expect(jestSpy).toHaveBeenCalledWith(httpRequest.body);
  });
  test("Should call 400 if Validation fails", async () => {
    const { sut, validation } = makeSut();
    jest.spyOn(validation, "validate").mockReturnValueOnce(new Error());

    const httpResponse = await sut.handle(makeFakeRequest());

    expect(httpResponse).toEqual(badRequest(new Error()));
  });

  test("Should call AddSurvey with correct values", async () => {
    const { sut, addSurveyStub } = makeSut();
    const jestSpy = jest.spyOn(addSurveyStub, "add");
    const httpRequest = makeFakeRequest();
    await sut.handle(httpRequest);

    expect(jestSpy).toHaveBeenCalledWith(httpRequest.body);
  });
  test("Should return 500 if AddSurvey throws", async () => {
    const { sut, addSurveyStub } = makeSut();
    jest
      .spyOn(addSurveyStub, "add")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error())),
      );
    const httpResponse = await sut.handle(makeFakeRequest());

    expect(httpResponse).toEqual(serverError(new Error()));
  });
  test("Should return 204 on success", async () => {
    const { sut } = makeSut();

    const httpResponse = await sut.handle(makeFakeRequest());

    expect(httpResponse).toEqual(noContent());
  });
});
