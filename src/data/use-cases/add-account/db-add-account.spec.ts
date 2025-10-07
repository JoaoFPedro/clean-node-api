import { Encrypter } from "../../protocols/encrypter";
import { DbAddAccount } from "./db-add-account";

interface SutType {
  sut: DbAddAccount;
  encrypterStub: Encrypter;
}
const makeSut = (): any => {
  class EncrypterStub {
    async encrypt(value: string): Promise<string> {
      return "hashed_password";
    }
  }
  const encrypterStub = new EncrypterStub();
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
});
