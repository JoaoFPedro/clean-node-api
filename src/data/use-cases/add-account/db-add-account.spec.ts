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
const makeFakeAccount = (): AccountModel => ({
  id: "any_id",
  name: "any_name",
  email: "any_email",
  password: "hashed_password",
});
interface SutType {
  sut: DbAddAccount;
  encrypterStub: Hasher;
  addAccountRepositoryStub: AddAccountRepository;
  accountData: AddAccountModel;
}
const makeFakeAccountData = (): AddAccountModel => ({
  name: "any_name",
  email: "any_email",
  password: "any_password",
});
const makeSut = (): SutType => {
  const encrypterStub = makeEncrypter();
  const addAccountRepositoryStub = makeAddAccountRespository();
  const sut = new DbAddAccount(encrypterStub, addAccountRepositoryStub);
  const accountData = makeFakeAccountData();

  return {
    sut,
    encrypterStub,
    addAccountRepositoryStub,
    accountData,
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
        new Promise((resolve, reject) => reject(new Error()))
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
        new Promise((resolve, reject) => reject(new Error()))
      );

    const promise = sut.add(accountData);
    await expect(promise).rejects.toThrow();
  });
  test("Should return an account on sucess", async () => {
    const { sut, accountData } = makeSut();

    const fakeAccount = await sut.add(accountData);
    expect(fakeAccount).toEqual(makeFakeAccount());
  });
});
