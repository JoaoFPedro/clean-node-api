import { Encrypter } from "../../protocols/encrypter";
import { DbAddAccount } from "./db-add-account";

interface SutType {
  sut: DbAddAccount;
  encrypterStub: Encrypter;
}
const makeEncrypter = (): Encrypter => {
  class EncrypterStub {
    async encrypt(value: string): Promise<string> {
      return "hashed_password";
    }
  }
  return new EncrypterStub();
};
const makeSut = (): SutType => {
  const encrypterStub = makeEncrypter();

  const sut = new DbAddAccount(encrypterStub);

  return {
    sut,
    encrypterStub,
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
});
