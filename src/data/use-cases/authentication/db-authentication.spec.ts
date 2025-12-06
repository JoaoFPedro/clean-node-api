import { AccountModel } from "../add-account/db-add-account-protocols";
import { LoadAccountByEmailRepository } from "../../protocols/db/load-account-by-email-repository";
import { DbAuthentication } from "./db-authentication";
import { HashComparer } from "../../protocols/criptography/hash-comparer";
import { UpdateAccessTokenRepository } from "../../protocols/db/update-access-token-repository";
import { Encrypter } from "../../protocols/criptography/encrypter";

const makeFakeAuthentication = (): any => ({
  email: "any_@mail.com",
  password: "any_password",
});
const makeHashComparer = (): HashComparer => {
  class HashComparerStub implements HashComparer {
    async compare(value: string, hash: string): Promise<boolean> {
      return true;
    }
  }
  return new HashComparerStub();
};
const makeTokenGenerator = (): Encrypter => {
  class Encrypter implements Encrypter {
    async encrypt(id: string): Promise<string> {
      return "any_token";
    }
  }
  return new Encrypter();
};
const makeUpdateAccessTokenRepository = (): UpdateAccessTokenRepository => {
  class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
    async update(value: string, token: string): Promise<void> {
      return;
    }
  }
  return new UpdateAccessTokenRepositoryStub();
};
const makeFakeAccount = (): AccountModel => ({
  id: "any_id",
  name: "any_name",
  email: "any_email",
  password: "hashed_password",
});
const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub
    implements LoadAccountByEmailRepository
  {
    async load(email: string): Promise<AccountModel> {
      const account = makeFakeAccount();
      return account;
    }
  }
  return new LoadAccountByEmailRepositoryStub();
};

const makeSut = (): any => {
  const hashComparerStub = makeHashComparer();
  const updateAccessTokenRepositoryStub = makeUpdateAccessTokenRepository();
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository();
  const tokenGeneratorStub = makeTokenGenerator();
  const sut = new DbAuthentication(
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    tokenGeneratorStub,
    updateAccessTokenRepositoryStub
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

    const jestSpy = jest.spyOn(loadAccountByEmailRepositoryStub, "load");
    await sut.auth(makeFakeAuthentication());

    expect(jestSpy).toHaveBeenCalledWith("any_@mail.com");
  });
  it("Should throw if LoadAccountByEmailRepository throws", async () => {
    const { loadAccountByEmailRepositoryStub, sut } = makeSut();

    jest
      .spyOn(loadAccountByEmailRepositoryStub, "load")
      .mockRejectedValueOnce(new Error());
    const promise = sut.auth(makeFakeAuthentication());

    expect(promise).rejects.toThrow();
  });
  it("Should return null if no account was found", async () => {
    const { loadAccountByEmailRepositoryStub, sut } = makeSut();

    jest
      .spyOn(loadAccountByEmailRepositoryStub, "load")
      .mockResolvedValueOnce(null);
    const authentication = await sut.auth(makeFakeAuthentication());

    expect(authentication).toBeNull();
  });
  it("Should call HashComparer with correct password", async () => {
    const { hashComparerStub, sut } = makeSut();

    const jestSpy = jest.spyOn(hashComparerStub, "compare");
    await sut.auth(makeFakeAuthentication());

    expect(jestSpy).toHaveBeenCalledWith("any_password", "hashed_password");
  });
  it("Should throw if HashComparer throws", async () => {
    const { hashComparerStub, sut } = makeSut();

    jest.spyOn(hashComparerStub, "compare").mockRejectedValueOnce(new Error());
    const promise = sut.auth(makeFakeAuthentication());

    await expect(promise).rejects.toThrow();
  });
  it("Should return null if HashComparer returns false", async () => {
    const { hashComparerStub, sut } = makeSut();

    jest.spyOn(hashComparerStub, "compare").mockResolvedValueOnce(false);
    const authentication = await sut.auth(makeFakeAuthentication());

    expect(authentication).toBeNull();
  });

  it("Should call Encrypter with correct id", async () => {
    const { tokenGeneratorStub, sut } = makeSut();

    const jestSpy = jest.spyOn(tokenGeneratorStub, "encrypt");
    await sut.auth(makeFakeAuthentication());

    expect(jestSpy).toHaveBeenCalledWith("any_id");
  });
  it("Should throw if Encrypter throws", async () => {
    const { tokenGeneratorStub, sut } = makeSut();

    jest
      .spyOn(tokenGeneratorStub, "encrypt")
      .mockRejectedValueOnce(new Error());
    const promise = sut.auth(makeFakeAuthentication());

    await expect(promise).rejects.toThrow();
  });
  it("Should return a token with success", async () => {
    const { tokenGeneratorStub, sut } = makeSut();

    jest.spyOn(tokenGeneratorStub, "encrypt");
    const token = await sut.auth(makeFakeAuthentication());

    expect(token).toBe("any_token");
  });

  it("Should call UpdateAccessTokenRepository with correct values", async () => {
    const { updateAccessTokenRepositoryStub, sut } = makeSut();

    const jestSpy = jest.spyOn(updateAccessTokenRepositoryStub, "update");
    await sut.auth(makeFakeAuthentication());

    expect(jestSpy).toHaveBeenCalledWith("any_id", "any_token");
  });
  it("Should throw if UpdateAccessTokenRepository throws", async () => {
    const { updateAccessTokenRepositoryStub, sut } = makeSut();

    jest
      .spyOn(updateAccessTokenRepositoryStub, "update")
      .mockRejectedValueOnce(new Error());
    const promise = sut.auth(makeFakeAuthentication());

    await expect(promise).rejects.toThrow();
  });
});
