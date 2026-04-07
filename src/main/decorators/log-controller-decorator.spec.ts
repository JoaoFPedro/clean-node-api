import { LogErrorRepository } from "@/data/protocols/db/log/log-error-repository";
import { success } from "@/presentation/helpers/http/http-helper";
import {
  Controller,
  HttpRequest,
  HttpResponse,
} from "@/presentation/protocols";
import { LogControllerDecorator } from "./log-controller-decorator";
import { mockAccount } from "@/domain/test/mock-account";
import {
  mockFakeServerError,
  mockLogController,
  mockLogErrorDecorator,
} from "@/data/test/mock-db-log-error";
import { mockFakeRequest } from "@/data/test/test-helper";
type SutTypes = {
  sut: LogControllerDecorator;
  controllerStub: Controller;
  logErrorRepositoryStub: LogErrorRepository;
  httpRequest: HttpRequest;
  error: HttpResponse;
};

const makeSut = (): SutTypes => {
  const controllerStub = mockLogController();
  const logErrorRepositoryStub = mockLogErrorDecorator();
  const httpRequest = mockFakeRequest();
  const error = mockFakeServerError();

  const sut = new LogControllerDecorator(
    controllerStub,
    logErrorRepositoryStub,
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

    expect(httpResponse).toEqual(success(mockAccount()));
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
