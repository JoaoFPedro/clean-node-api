import {
  Controller,
  HttpRequest,
  HttpResponse,
} from "@/presentation/protocols";
import { LogErrorRepository } from "../protocols/db/log/log-error-repository";
import { mockAccount } from "@/domain/test/mock-account";
import { serverError, success } from "@/presentation/helpers/http/http-helper";

export const mockLogErrorDecorator = (): LogErrorRepository => {
  class LogErrorRepositoryStub implements LogErrorRepository {
    async logError(stack: string): Promise<void> {
      return new Promise((resolve) => resolve());
    }
  }
  return new LogErrorRepositoryStub();
};

export const mockLogController = () => {
  class ControllerStub implements Controller {
    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
      return new Promise((resolve) => resolve(success(mockAccount())));
    }
  }
  return new ControllerStub();
};
export const mockFakeServerError = (): HttpResponse => {
  const fakeError = new Error();
  fakeError.stack = "any_stack";
  return serverError(fakeError);
};
