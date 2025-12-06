import { LogErrorRepository } from "../../data/protocols/db/log-error-repository";
import { AccountModel } from "../../domain/models/account";
import {
  success,
  serverError,
} from "../../presentation/helpers/http/http-helper";
import {
  Controller,
  HttpRequest,
  HttpResponse,
} from "../../presentation/protocols";
import { LogControllerDecorator } from "./log";
interface SutTypes {
  sut: LogControllerDecorator;
  controllerStub: Controller;
  logErrorRepositoryStub: LogErrorRepository;
  httpRequest: HttpRequest;
  error: HttpResponse;
}
const makeController = () => {
  class ControllerStub implements Controller {
    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
      return new Promise((resolve) => resolve(success(makeFakeAccount())));
    }
  }
  return new ControllerStub();
};
const makeFakeAccount = (): AccountModel => ({
  id: "any_id",
  name: "any_name",
  email: "any_email",
  password: "any_password",
});
const makeLogErrorDecorator = (): LogErrorRepository => {
  class LogErrorRepositoryStub implements LogErrorRepository {
    async logError(stack: string): Promise<void> {
      return new Promise((resolve) => resolve());
    }
  }
  return new LogErrorRepositoryStub();
};
const makeFakeRequest = () => ({
  body: {
    email: "any_mail@gmail.com",
    name: "any_name",
    password: "any_password",
    passwordConfirmation: "any_password",
  },
});
const makeFakeServerError = (): HttpResponse => {
  const fakeError = new Error();
  fakeError.stack = "any_stack";
  return serverError(fakeError);
};
const makeSut = (): SutTypes => {
  const controllerStub = makeController();
  const logErrorRepositoryStub = makeLogErrorDecorator();
  const httpRequest = makeFakeRequest();
  const error = makeFakeServerError();

  const sut = new LogControllerDecorator(
    controllerStub,
    logErrorRepositoryStub
  );

  return {
    sut,
    controllerStub,
    logErrorRepositoryStub,
    httpRequest,
    error,
  };
};
describe("Log Controller decorator", () => {
  it("Should reconnect if mongodb is down", async () => {
    const { controllerStub, sut, httpRequest } = makeSut();
    const handleSpy = jest.spyOn(controllerStub, "handle");
    await sut.handle(httpRequest);

    expect(handleSpy).toHaveBeenCalledWith(httpRequest);
  });
  it("Should return the same result of the controller", async () => {
    const { sut, httpRequest } = makeSut();
    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(success(makeFakeAccount()));
  });
  it("should call LogErrorRepository with correct error if controller returns a server error", async () => {
    const { sut, controllerStub, logErrorRepositoryStub, httpRequest, error } =
      makeSut();

    const logSpy = jest.spyOn(logErrorRepositoryStub, "logError");
    jest.spyOn(controllerStub, "handle").mockResolvedValueOnce(error);

    await sut.handle(httpRequest);
    expect(logSpy).toHaveBeenCalledWith("any_stack");
  });
});
