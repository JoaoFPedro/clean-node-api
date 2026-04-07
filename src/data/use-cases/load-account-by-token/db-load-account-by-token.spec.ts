import { mockAccount } from "@/domain/test/mock-account";
import { DbLoadAccountByToken } from "./db-load-account-by-token";
import {
  AccountModel,
  Decrypter,
  LoadAccountByTokenRepository,
} from "./db-load-account-by-token-protocols";
import { throwError } from "@/domain/test/test-helper";
import { mockDecrypter } from "@/data/test/mock-criptography";
import { mockloadAccountByTokenRepository } from "@/data/test/mock-db-account";

type SutTypes = {
  sut: DbLoadAccountByToken;
  decrypter: Decrypter;
  loadAccountByTokenRepository: LoadAccountByTokenRepository;
};
const makeSut = (): SutTypes => {
  const loadAccountByTokenRepository = mockloadAccountByTokenRepository();
  const decrypter = mockDecrypter();
  const sut = new DbLoadAccountByToken(decrypter, loadAccountByTokenRepository);

  return {
    sut,
    decrypter,
    loadAccountByTokenRepository,
  };
};
describe("Auth DbLoadAccountByToken UseCase", () => {
  test("Should call Decrypter with correct values", async () => {
    const { sut, decrypter } = makeSut();
    const jestSpy = jest.spyOn(decrypter, "decrypt");
    await sut.loadByToken("any_token", "any_role");
    expect(jestSpy).toHaveBeenCalledWith("any_token");
  });
  test("Should return null if Decrypter returns null", async () => {
    const { sut, decrypter } = makeSut();
    jest.spyOn(decrypter, "decrypt").mockResolvedValueOnce(null as any);
    const httpResponse = await sut.loadByToken("any_token", "any_role");
    expect(httpResponse).toBeNull();
  });
  test("Should call LoadAccountByTokenRepository with correct values", async () => {
    const { sut, loadAccountByTokenRepository } = makeSut();
    const jestSpy = jest.spyOn(loadAccountByTokenRepository, "loadByToken");
    await sut.loadByToken("any_token", "any_role");
    expect(jestSpy).toHaveBeenCalledWith("any_token", "any_role");
  });
  test("Should return null if Decrypter returns null", async () => {
    const { sut, loadAccountByTokenRepository } = makeSut();
    jest
      .spyOn(loadAccountByTokenRepository, "loadByToken")
      .mockResolvedValueOnce(null as any);
    const httpResponse = await sut.loadByToken("any_token", "any_role");
    expect(httpResponse).toBeNull();
  });
  test("Should return an account on Sucess", async () => {
    const { sut, loadAccountByTokenRepository } = makeSut();
    jest.spyOn(loadAccountByTokenRepository, "loadByToken");
    const account = await sut.loadByToken("any_token", "any_role");
    expect(account).toEqual(mockAccount());
  });
  test("Should return 500 if Decrypter throws", async () => {
    const { sut, decrypter } = makeSut();
    jest.spyOn(decrypter, "decrypt").mockImplementationOnce(() => throwError());
    const httpResponse = sut.loadByToken("any_token", "any_role");
    await expect(httpResponse).rejects.toThrow();
  });
  test("Should return 500 if Decrypter throws", async () => {
    const { sut, loadAccountByTokenRepository } = makeSut();
    jest
      .spyOn(loadAccountByTokenRepository, "loadByToken")
      .mockImplementationOnce(() => throwError());
    const httpResponse = sut.loadByToken("any_token", "any_role");
    await expect(httpResponse).rejects.toThrow();
  });
});
