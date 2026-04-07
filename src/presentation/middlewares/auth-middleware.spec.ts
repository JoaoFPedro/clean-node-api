import { forbidden, serverError, success } from "../helpers/http/http-helper";
import { AccessDeniedError } from "../erros";
import { AuthMiddleware } from "./auth-middleware";
import { LoadAccountByToken } from "../../domain/use-cases/add-account/load-account-by-token";
import { AccountModel } from "../../domain/models/account";
import { HttpRequest } from "../protocols";
import { mockAccount } from "@/domain/test/mock-account";
import { throwError } from "@/domain/test/test-helper";

const makeFakeRequest = (): HttpRequest => ({
  headers: {
    "x-access-token": "any_token",
  },
});

const makeLoadAccountByToken = () => {
  class LoadAccountByTokenStub implements LoadAccountByToken {
    loadByToken(accesToken: string, rorle?: string): Promise<AccountModel> {
      return new Promise((resolve) => resolve(mockAccount()));
    }
  }
  return new LoadAccountByTokenStub();
};
const makeSut = (role?: string): any => {
  const loadAccountByTokenStub = makeLoadAccountByToken();
  const sut = new AuthMiddleware(loadAccountByTokenStub, role!);

  return {
    sut,
    loadAccountByTokenStub,
  };
};
describe("Auth Middleware", () => {
  test("Should return 403 if no x-access-token exist in headers", async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle({});
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()));
  });
  test("Should call LoadAccountByToken with correct accessToken", async () => {
    const { sut, loadAccountByTokenStub } = makeSut("any_role");

    const jestSpy = jest.spyOn(loadAccountByTokenStub, "loadByToken");
    await sut.handle(makeFakeRequest());
    expect(jestSpy).toHaveBeenCalledWith("any_token", "any_role");
  });
  test("Should return 403 if LoadAccountByToken returns null", async () => {
    const { sut, loadAccountByTokenStub } = makeSut();
    jest
      .spyOn(loadAccountByTokenStub, "loadByToken")
      .mockReturnValueOnce(new Promise((resolve) => resolve(null)));
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()));
  });
  test("Should return 200 if LoadAccountByToken returns an account", async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(success({ accountId: "any_id" }));
  });
  test("Should return 500 if LoadAccountByToken throws", async () => {
    const { sut, loadAccountByTokenStub } = makeSut();
    jest
      .spyOn(loadAccountByTokenStub, "loadByToken")
      .mockImplementationOnce(() => throwError());
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });
});
