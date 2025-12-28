import { MissingParamError } from "../../erros";
import {
  badRequest,
  serverError,
  success,
  unauthorized,
} from "../../helpers/http/http-helper";

import { Validation } from "../../protocols/validation";
import { LoginController } from "./login-controller";
import {
  Authentication,
  AuthenticationModel,
} from "./login-controller-protocols";

interface SutType {
  sut: LoginController;
  authenticationStub: Authentication;
  validationStub: Validation;
}

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate(input: any): Error | null {
      return null;
    }
  }
  return new ValidationStub();
};

const makeAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth(authenticantion: AuthenticationModel): Promise<string | null> {
      return "any_token";
    }
  }
  return new AuthenticationStub();
};
const makeFakeRequest = () => ({
  body: {
    email: "any_mail@mail.com",
    password: "any_password",
  },
});

const makeSut = (): SutType => {
  const authenticationStub = makeAuthentication();
  const validationStub = makeValidation();
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

    await sut.handle(makeFakeRequest());

    expect(authSpy).toHaveBeenCalledWith({
      email: "any_mail@mail.com",
      password: "any_password",
    });
  });
  test("Should return 401 if invalid credentials are provided", async () => {
    const { sut, authenticationStub } = makeSut();
    const jestSpy = jest
      .spyOn(authenticationStub, "auth")
      .mockReturnValueOnce(new Promise((resolve) => resolve(null)));

    const httpResponse = await sut.handle(makeFakeRequest());

    expect(httpResponse).toEqual(unauthorized());
  });
  test("Should return 500 if Authentication throws", async () => {
    const { sut, authenticationStub } = makeSut();
    const jestSpy = jest
      .spyOn(authenticationStub, "auth")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      ); //assim pq o metodo é async

    const httpResponse = await sut.handle(makeFakeRequest());

    expect(httpResponse).toEqual(serverError(new Error()));
  });
  test("Should return 200 if valid credentials are provided", async () => {
    const { sut } = makeSut();

    const httpResponse = await sut.handle(makeFakeRequest());

    expect(httpResponse).toEqual(success({ accessToken: "any_token" }));
  });
  test("Should call Validation with correct values", async () => {
    const { sut, validationStub } = makeSut();
    const jestSpy = jest.spyOn(validationStub, "validate");
    const httpRequest = makeFakeRequest();
    await sut.handle(httpRequest);
    expect(jestSpy).toHaveBeenCalledWith(httpRequest.body);
  });
  test("Should return 400 if Validation return an error", async () => {
    const { sut, validationStub } = makeSut();
    jest
      .spyOn(validationStub, "validate")
      .mockReturnValueOnce(new MissingParamError("any_field"));
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(
      badRequest(new MissingParamError("any_field"))
    );
  });
});
