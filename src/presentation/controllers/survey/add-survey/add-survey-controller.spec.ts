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
  AddSurveyParams,
} from "../../../../domain/use-cases/survey/add-survey";
import MockDate from "mockdate";
import { throwError } from "@/domain/test/test-helper";
import { mockValidation } from "@/presentation/tests/mock-login-controller";
import { mockFakeAddSurveyRequest } from "@/presentation/tests/test-helper";
import { mockAddSurvey } from "@/presentation/tests/mock-add-survey";

type SutTypes = {
  sut: AddSurveyController;
  validation: Validation;
  addSurveyStub: AddSurvey;
};
const makeSut = (): SutTypes => {
  const validation = mockValidation();
  const addSurveyStub = mockAddSurvey();

  const sut = new AddSurveyController(validation, addSurveyStub);

  return {
    sut,
    validation,
    addSurveyStub,
  };
};
describe("Add-survey Controller", () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });

  test("Should call Validation with correct values", async () => {
    const { sut, validation } = makeSut();
    const jestSpy = jest.spyOn(validation, "validate");
    const httpRequest = mockFakeAddSurveyRequest();
    await sut.handle(httpRequest);

    expect(jestSpy).toHaveBeenCalledWith(httpRequest.body);
  });
  test("Should call 400 if Validation fails", async () => {
    const { sut, validation } = makeSut();
    jest.spyOn(validation, "validate").mockReturnValueOnce(new Error());

    const httpResponse = await sut.handle(mockFakeAddSurveyRequest());

    expect(httpResponse).toEqual(badRequest(new Error()));
  });

  test("Should call AddSurvey with correct values", async () => {
    const { sut, addSurveyStub } = makeSut();
    const jestSpy = jest.spyOn(addSurveyStub, "add");
    const httpRequest = mockFakeAddSurveyRequest();
    await sut.handle(httpRequest);

    expect(jestSpy).toHaveBeenCalledWith(httpRequest.body);
  });
  test("Should return 500 if AddSurvey throws", async () => {
    const { sut, addSurveyStub } = makeSut();
    jest.spyOn(addSurveyStub, "add").mockImplementationOnce(() => throwError());
    const httpResponse = await sut.handle(mockFakeAddSurveyRequest());

    expect(httpResponse).toEqual(serverError(new Error()));
  });
  test("Should return 204 on success", async () => {
    const { sut } = makeSut();

    const httpResponse = await sut.handle(mockFakeAddSurveyRequest());

    expect(httpResponse).toEqual(noContent());
  });
});
