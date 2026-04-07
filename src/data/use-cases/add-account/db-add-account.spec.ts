import { mockAccount, mockAddAccountParams } from "@/domain/test/mock-account";
import { DbAddAccount } from "./db-add-account";
import {
  AccountModel,
  AddAccountParams,
  Hasher,
  AddAccountRepository,
  LoadAccountByEmailRepository,
} from "./db-add-account-protocols";
import { throwError } from "@/domain/test/test-helper";
import { mockEncrypter } from "@/data/test/mock-criptography";
import {
  mockAddAccountRespository,
  mockLoadAccountByEmailRepository,
} from "@/data/test/mock-db-account";

interface SutType {
  sut: DbAddAccount;
  encrypterStub: Hasher;
  addAccountRepositoryStub: AddAccountRepository;
  accountData: AddAccountParams;
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository;
}

const makeSut = (): SutType => {
  const encrypterStub = mockEncrypter();
  const addAccountRepositoryStub = mockAddAccountRespository();
  const loadAccountByEmailRepositoryStub = mockLoadAccountByEmailRepository();
  const sut = new DbAddAccount(
    encrypterStub,
    addAccountRepositoryStub,
    loadAccountByEmailRepositoryStub,
  );
  const accountData = mockAddAccountParams();

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
      .mockImplementationOnce(() => throwError());

    const promise = sut.add(accountData);
    await expect(promise).rejects.toThrow();
  });

  test("Should call AddAccountRepository with  correct values", async () => {
    const { sut, addAccountRepositoryStub, accountData } = makeSut();
    const AddAccountRepositorySpy = jest.spyOn(addAccountRepositoryStub, "add");

    await sut.add(accountData);
    expect(AddAccountRepositorySpy).toHaveBeenLastCalledWith({
      name: "any_name",
      email: "any_email@mail.com",
      password: "hashed_password",
    });
  });
  test("Should throw if AddAccountRepository throws", async () => {
    const { sut, addAccountRepositoryStub, accountData } = makeSut();
    jest
      .spyOn(addAccountRepositoryStub, "add")
      .mockImplementationOnce(() => throwError());

    const promise = sut.add(accountData);
    await expect(promise).rejects.toThrow();
  });
  test("Should return an account on sucess", async () => {
    const { sut, accountData } = makeSut();

    const fakeAccount = await sut.add(accountData);
    expect(fakeAccount).toEqual(mockAccount());
  });

  it("Should call LoadAccountByEmailRepository with correct email", async () => {
    const { loadAccountByEmailRepositoryStub, sut, accountData } = makeSut();

    const jestSpy = jest.spyOn(loadAccountByEmailRepositoryStub, "loadByEmail");
    await sut.add(accountData);

    expect(jestSpy).toHaveBeenCalledWith("any_email@mail.com");
  });
  it("Should return null when LoadAccountByEmailRepository finds an existing account", async () => {
    const { loadAccountByEmailRepositoryStub, sut } = makeSut();

    jest
      .spyOn(loadAccountByEmailRepositoryStub, "loadByEmail")
      .mockReturnValueOnce(new Promise((resolve) => resolve(mockAccount())));
    const account = await sut.add(mockAccount());

    expect(account).toBeNull();
  });
});
