import { DbAddAccount } from "./db-add-account";
import {
  AccountModel,
  AddAccountModel,
  Encrypter,
  AddAccountRepository,
} from "./db-add-account-protocols";

const makeEncrypter = (): Encrypter => {
  class EncrypterStub {
    async encrypt(value: string): Promise<string> {
      return "hashed_password";
    }
  }
  return new EncrypterStub();
};
const makeAddAccountRespository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add(account: AddAccountModel): Promise<AccountModel | null> {
      const fakeAccount = {
        id: "any_id",
        name: "any_name",
        email: "any_email",
        password: "hashed_password",
      };
      return fakeAccount;
    }
  }
  return new AddAccountRepositoryStub();
};
interface SutType {
  sut: DbAddAccount;
  encrypterStub: Encrypter;
  addAccountRepositoryStub: AddAccountRepository;
}
const makeSut = (): SutType => {
  const encrypterStub = makeEncrypter();
  const addAccountRepositoryStub = makeAddAccountRespository();
  const sut = new DbAddAccount(encrypterStub, addAccountRepositoryStub);

  return {
    sut,
    encrypterStub,
    addAccountRepositoryStub,
  };
};
describe("DBAddAccount Use case", () => {
  test("Should call Encrypter with correct password", async () => {
    const { sut, encrypterStub } = makeSut();
    const encryptSpy = jest.spyOn(encrypterStub, "encrypt");
    const accountData = {
      name: "any_name",
      email: "any_email",
      password: "any_password",
    };
    await sut.add(accountData);
    expect(encryptSpy).toHaveBeenLastCalledWith("any_password");
  });
  test("Should throw if Encrypter throws", async () => {
    const { sut, encrypterStub } = makeSut();
    jest
      .spyOn(encrypterStub, "encrypt")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );
    const accountData = {
      name: "any_name",
      email: "any_email",
      password: "any_password",
    };
    const promise = sut.add(accountData);
    await expect(promise).rejects.toThrow();
  });

  test("Should call AddAccountRepository with  correct values", async () => {
    const { sut, addAccountRepositoryStub } = makeSut();
    const AddAccountRepositorySpy = jest.spyOn(addAccountRepositoryStub, "add");
    const accountData = {
      name: "any_name",
      email: "any_email",
      password: "valid_password",
    };
    await sut.add(accountData);
    expect(AddAccountRepositorySpy).toHaveBeenLastCalledWith({
      name: "any_name",
      email: "any_email",
      password: "hashed_password",
    });
  });
  test("Should throw if AddAccountRepository throws", async () => {
    const { sut, addAccountRepositoryStub } = makeSut();
    jest
      .spyOn(addAccountRepositoryStub, "add")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );
    const accountData = {
      name: "any_name",
      email: "any_email",
      password: "any_password",
    };
    const promise = sut.add(accountData);
    await expect(promise).rejects.toThrow();
  });
  test("Should return an account on sucess", async () => {
    const { sut } = makeSut();
    const accountData = {
      name: "any_name",
      email: "any_email",
      password: "valid_password",
    };
    const fakeAccount = await sut.add(accountData);
    expect(fakeAccount).toEqual({
      id: "any_id",
      name: "any_name",
      email: "any_email",
      password: "hashed_password",
    });
  });
});
