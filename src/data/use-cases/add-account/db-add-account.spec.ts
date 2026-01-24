import { LoadAccountByEmailRepository } from "../../protocols/db/account/load-account-by-email-repository";
import { DbAddAccount } from "./db-add-account";
import {
  AccountModel,
  AddAccountModel,
  Hasher,
  AddAccountRepository,
} from "./db-add-account-protocols";

const makeEncrypter = (): Hasher => {
  class EncrypterStub {
    async hash(value: string): Promise<string> {
      return "hashed_password";
    }
  }
  return new EncrypterStub();
};
const makeAddAccountRespository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add(account: AddAccountModel): Promise<AccountModel | null> {
      const fakeAccount = makeFakeAccount();
      return fakeAccount;
    }
  }
  return new AddAccountRepositoryStub();
};
const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async loadByEmail(email: string): Promise<AccountModel | null> {
      return null;
    }
  }
  return new LoadAccountByEmailRepositoryStub();
};
const makeFakeAccount = (): AccountModel => ({
  id: "any_id",
  name: "any_name",
  email: "aany_email",
  password: "hashed_password",
});
interface SutType {
  sut: DbAddAccount;
  encrypterStub: Hasher;
  addAccountRepositoryStub: AddAccountRepository;
  accountData: AddAccountModel;
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository;
}
const makeFakeAccountData = (): AddAccountModel => ({
  name: "any_name",
  email: "any_email",
  password: "any_password",
});
const makeSut = (): SutType => {
  const encrypterStub = makeEncrypter();
  const addAccountRepositoryStub = makeAddAccountRespository();
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository();
  const sut = new DbAddAccount(
    encrypterStub,
    addAccountRepositoryStub,
    loadAccountByEmailRepositoryStub,
  );
  const accountData = makeFakeAccountData();

  return {
    sut,
    encrypterStub,
    addAccountRepositoryStub,
    accountData,
    loadAccountByEmailRepositoryStub,
  };
};
describe("DBAddAccount Use case", () => {
  test("Should call Hasher with correct password", async () => {
    const { sut, encrypterStub, accountData } = makeSut();
    const encryptSpy = jest.spyOn(encrypterStub, "hash");

    await sut.add(accountData);
    expect(encryptSpy).toHaveBeenLastCalledWith("any_password");
  });
  test("Should throw if Hasher throws", async () => {
    const { sut, encrypterStub, accountData } = makeSut();
    jest
      .spyOn(encrypterStub, "hash")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error())),
      );

    const promise = sut.add(accountData);
    await expect(promise).rejects.toThrow();
  });

  test("Should call AddAccountRepository with  correct values", async () => {
    const { sut, addAccountRepositoryStub, accountData } = makeSut();
    const AddAccountRepositorySpy = jest.spyOn(addAccountRepositoryStub, "add");

    await sut.add(accountData);
    expect(AddAccountRepositorySpy).toHaveBeenLastCalledWith({
      name: "any_name",
      email: "any_email",
      password: "hashed_password",
    });
  });
  test("Should throw if AddAccountRepository throws", async () => {
    const { sut, addAccountRepositoryStub, accountData } = makeSut();
    jest
      .spyOn(addAccountRepositoryStub, "add")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error())),
      );

    const promise = sut.add(accountData);
    await expect(promise).rejects.toThrow();
  });
  test("Should return an account on sucess", async () => {
    const { sut, accountData } = makeSut();

    const fakeAccount = await sut.add(accountData);
    expect(fakeAccount).toEqual(makeFakeAccount());
  });

  it("Should call LoadAccountByEmailRepository with correct email", async () => {
    const { loadAccountByEmailRepositoryStub, sut, accountData } = makeSut();

    const jestSpy = jest.spyOn(loadAccountByEmailRepositoryStub, "loadByEmail");
    await sut.add(accountData);

    expect(jestSpy).toHaveBeenCalledWith("any_email");
  });
  it("Should return null when LoadAccountByEmailRepository finds an existing account", async () => {
    const { loadAccountByEmailRepositoryStub, sut } = makeSut();

    jest
      .spyOn(loadAccountByEmailRepositoryStub, "loadByEmail")
      .mockReturnValueOnce(
        new Promise((resolve) => resolve(makeFakeAccount())),
      );
    const account = await sut.add(makeFakeAccount());

    expect(account).toBeNull();
  });
});
