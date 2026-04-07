import {
  AccountModel,
  LoadAccountByEmailRepository,
} from "../add-account/db-add-account-protocols";
import { DbAuthentication } from "./db-authentication";
import { mockAccount } from "@/domain/test/mock-account";
import {
  mockHashComparer,
  mockTokenGenerator,
} from "@/data/test/mock-criptography";
import { mockUpdateAccessTokenRepository } from "@/data/test/mock-db-account";
import { mockFakeAuthentication } from "@/data/test/test-helper";

const mockLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async loadByEmail(email: string): Promise<AccountModel> {
      const account = mockAccount();
      return account;
    }
  }
  return new LoadAccountByEmailRepositoryStub();
};

const makeSut = (): any => {
  const hashComparerStub = mockHashComparer();
  const updateAccessTokenRepositoryStub = mockUpdateAccessTokenRepository();
  const loadAccountByEmailRepositoryStub = mockLoadAccountByEmailRepository();
  const tokenGeneratorStub = mockTokenGenerator();
  const sut = new DbAuthentication(
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    tokenGeneratorStub,
    updateAccessTokenRepositoryStub,
  );
  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    tokenGeneratorStub,
    updateAccessTokenRepositoryStub,
  };
};

describe("DbAuthentication UseCase", () => {
  it("Should call LoadAccountByEmailRepository with correct email", async () => {
    const { loadAccountByEmailRepositoryStub, sut } = makeSut();

    const jestSpy = jest.spyOn(loadAccountByEmailRepositoryStub, "loadByEmail");
    await sut.auth(mockFakeAuthentication());

    expect(jestSpy).toHaveBeenCalledWith("any_@mail.com");
  });
  it("Should throw if LoadAccountByEmailRepository throws", async () => {
    const { loadAccountByEmailRepositoryStub, sut } = makeSut();

    jest
      .spyOn(loadAccountByEmailRepositoryStub, "loadByEmail")
      .mockRejectedValueOnce(new Error());
    const promise = sut.auth(mockFakeAuthentication());

    expect(promise).rejects.toThrow();
  });
  it("Should return null if no account was found", async () => {
    const { loadAccountByEmailRepositoryStub, sut } = makeSut();

    jest
      .spyOn(loadAccountByEmailRepositoryStub, "loadByEmail")
      .mockResolvedValueOnce(null);
    const authentication = await sut.auth(mockFakeAuthentication());

    expect(authentication).toBeNull();
  });
  it("Should call HashComparer with correct password", async () => {
    const { hashComparerStub, sut } = makeSut();

    const jestSpy = jest.spyOn(hashComparerStub, "compare");
    await sut.auth(mockFakeAuthentication());

    expect(jestSpy).toHaveBeenCalledWith("any_password", "hashed_password");
  });
  it("Should throw if HashComparer throws", async () => {
    const { hashComparerStub, sut } = makeSut();

    jest.spyOn(hashComparerStub, "compare").mockRejectedValueOnce(new Error());
    const promise = sut.auth(mockFakeAuthentication());

    await expect(promise).rejects.toThrow();
  });
  it("Should return null if HashComparer returns false", async () => {
    const { hashComparerStub, sut } = makeSut();

    jest.spyOn(hashComparerStub, "compare").mockResolvedValueOnce(false);
    const authentication = await sut.auth(mockFakeAuthentication());

    expect(authentication).toBeNull();
  });

  it("Should call Encrypter with correct id", async () => {
    const { tokenGeneratorStub, sut } = makeSut();

    const jestSpy = jest.spyOn(tokenGeneratorStub, "encrypt");
    await sut.auth(mockFakeAuthentication());

    expect(jestSpy).toHaveBeenCalledWith("any_id");
  });
  it("Should throw if Encrypter throws", async () => {
    const { tokenGeneratorStub, sut } = makeSut();

    jest
      .spyOn(tokenGeneratorStub, "encrypt")
      .mockRejectedValueOnce(new Error());
    const promise = sut.auth(mockFakeAuthentication());

    await expect(promise).rejects.toThrow();
  });
  it("Should return a token with success", async () => {
    const { tokenGeneratorStub, sut } = makeSut();

    jest.spyOn(tokenGeneratorStub, "encrypt");
    const token = await sut.auth(mockFakeAuthentication());

    expect(token).toBe("any_token");
  });

  it("Should call UpdateAccessTokenRepository with correct values", async () => {
    const { updateAccessTokenRepositoryStub, sut } = makeSut();

    const jestSpy = jest.spyOn(
      updateAccessTokenRepositoryStub,
      "updateAccessToken",
    );
    await sut.auth(mockFakeAuthentication());

    expect(jestSpy).toHaveBeenCalledWith("any_id", "any_token");
  });
  it("Should throw if UpdateAccessTokenRepository throws", async () => {
    const { updateAccessTokenRepositoryStub, sut } = makeSut();

    jest
      .spyOn(updateAccessTokenRepositoryStub, "updateAccessToken")
      .mockRejectedValueOnce(new Error());
    const promise = sut.auth(mockFakeAuthentication());

    await expect(promise).rejects.toThrow();
  });
});
