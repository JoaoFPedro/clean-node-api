import { throwError } from "@/domain/test/test-helper";
import { MissingParamError } from "../../../erros";
import {
  badRequest,
  serverError,
  success,
  unauthorized,
} from "../../../helpers/http/http-helper";

import { Validation } from "../../../protocols/validation";
import { LoginController } from "./login-controller";
import {
  Authentication,
  AuthenticationParams,
} from "./login-controller-protocols";
import {
  mockAuthentication,
  mockValidation,
} from "@/presentation/tests/mock-login-controller";
import { mockFakeRequest } from "@/data/test/test-helper";

interface SutType {
  sut: LoginController;
  authenticationStub: Authentication;
  validationStub: Validation;
}

const makeSut = (): SutType => {
  const authenticationStub = mockAuthentication();
  const validationStub = mockValidation();
  const sut = new LoginController(validationStub, authenticationStub);

  return {
    sut,
    authenticationStub,
    validationStub,
  };
};
describe("Login Controller", () => {
  test("Should call  Authentication with correct params", async () => {
    const { sut, authenticationStub } = makeSut();
    const authSpy = jest.spyOn(authenticationStub, "auth");

    await sut.handle(mockFakeRequest());

    expect(authSpy).toHaveBeenCalledWith({
      email: "any_mail@gmail.com",
      password: "any_password",
    });
  });
  test("Should return 401 if invalid credentials are provided", async () => {
    const { sut, authenticationStub } = makeSut();
    const jestSpy = jest
      .spyOn(authenticationStub, "auth")
      .mockReturnValueOnce(new Promise((resolve) => resolve(null)));

    const httpResponse = await sut.handle(mockFakeRequest());

    expect(httpResponse).toEqual(unauthorized());
  });
  test("Should return 500 if Authentication throws", async () => {
    const { sut, authenticationStub } = makeSut();
    const jestSpy = jest
      .spyOn(authenticationStub, "auth")
      .mockImplementationOnce(() => throwError()); //assim pq o metodo é async

    const httpResponse = await sut.handle(mockFakeRequest());

    expect(httpResponse).toEqual(serverError(new Error()));
  });
  test("Should return 200 if valid credentials are provided", async () => {
    const { sut } = makeSut();

    const httpResponse = await sut.handle(mockFakeRequest());

    expect(httpResponse).toEqual(success({ accessToken: "any_token" }));
  });
  test("Should call Validation with correct values", async () => {
    const { sut, validationStub } = makeSut();
    const jestSpy = jest.spyOn(validationStub, "validate");
    const httpRequest = mockFakeRequest();
    await sut.handle(httpRequest);
    expect(jestSpy).toHaveBeenCalledWith(httpRequest.body);
  });
  test("Should return 400 if Validation return an error", async () => {
    const { sut, validationStub } = makeSut();
    jest
      .spyOn(validationStub, "validate")
      .mockReturnValueOnce(new MissingParamError("any_field"));
    const httpResponse = await sut.handle(mockFakeRequest());
    expect(httpResponse).toEqual(
      badRequest(new MissingParamError("any_field")),
    );
  });
});
