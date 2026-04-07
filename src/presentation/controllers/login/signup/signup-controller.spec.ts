import { AddAccount } from "../../../../domain/use-cases/add-account/add-account-use-case";
import {
  MissingParamError,
  ServerError,
  EmailInUseError,
} from "../../../erros";
import { HttpRequest } from "../../../protocols";
import { SignUpController } from "./signup-controller";
import { Validation } from "../../../protocols/validation";
import {
  serverError,
  success,
  badRequest,
  forbidden,
} from "../../../helpers/http/http-helper";
import { Authentication } from "../login/login-controller-protocols";
import { throwError } from "@/domain/test/test-helper";
import { mockFakeRequest } from "@/data/test/test-helper";
import {
  mockAuthentication,
  mockValidation,
} from "@/presentation/tests/mock-login-controller";
import { mockAddAccount } from "@/presentation/tests/mock-signup-controller";

//Factory

interface SutType {
  sut: SignUpController;
  addAccount: AddAccount;
  httpRequest: HttpRequest;
  validationStub: Validation;
  authenticationStub: Authentication;
}
const makeSut = (): SutType => {
  const addAccount = mockAddAccount();
  const authenticationStub = mockAuthentication();

  const httpRequest = mockFakeRequest();
  const validationStub = mockValidation();
  const sut = new SignUpController(
    addAccount,
    validationStub,
    authenticationStub,
  );
  return {
    sut,
    addAccount,
    httpRequest,
    validationStub,
    authenticationStub,
  };
};

describe("SignUp Controller", () => {
  test("Should call AddAcount with correct values", () => {
    const { sut, addAccount, httpRequest } = makeSut();
    const jestSpy = jest.spyOn(addAccount, "add");
    sut.handle(httpRequest);
    expect(jestSpy).toHaveBeenCalledWith({
      name: "any_name",
      email: "any_mail@gmail.com",
      password: "any_password",
    });
  });
  test("Should return 500 if AddAccount throws", async () => {
    const { sut, addAccount, httpRequest } = makeSut();
    jest.spyOn(addAccount, "add").mockImplementationOnce(() => {
      throw new Error();
    });

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(serverError(new ServerError()));
  });
  test("Should return 200 if sucess", async () => {
    const { sut, httpRequest } = makeSut();
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(success({ accessToken: "any_token" }));
  });
  test("Should return 403 if addAccount returns null", async () => {
    const { sut, httpRequest, addAccount } = makeSut();
    jest
      .spyOn(addAccount, "add")
      .mockReturnValueOnce(new Promise((resolve) => resolve(null)));
    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(forbidden(new EmailInUseError()));
  });
  test("Should call Validation with correct values", async () => {
    const { sut, validationStub, httpRequest } = makeSut();
    const jestSpy = jest.spyOn(validationStub, "validate");
    await sut.handle(httpRequest);
    expect(jestSpy).toHaveBeenCalledWith(httpRequest.body);
  });
  test("Should return 400 if Validation return an error", async () => {
    const { sut, validationStub, httpRequest } = makeSut();
    jest
      .spyOn(validationStub, "validate")
      .mockReturnValueOnce(new MissingParamError("any_field"));
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(
      badRequest(new MissingParamError("any_field")),
    );
  });

  test("Should call  Authentication with correct params", async () => {
    const { sut, authenticationStub } = makeSut();
    const authSpy = jest.spyOn(authenticationStub, "auth");

    await sut.handle(mockFakeRequest());

    expect(authSpy).toHaveBeenCalledWith({
      email: "any_mail@gmail.com",
      password: "any_password",
    });
  });

  test("Should return 500 if Authentication throws", async () => {
    const { sut, authenticationStub } = makeSut();
    const jestSpy = jest
      .spyOn(authenticationStub, "auth")
      .mockImplementationOnce(() => throwError()); //assim pq o metodo é async

    const httpResponse = await sut.handle(mockFakeRequest());

    expect(httpResponse).toEqual(serverError(new Error()));
  });
});
