import bcrypt from "bcrypt";
import { BCrypterAdapter } from "./bcrypt";

jest.mock("bcrypt", () => ({
  async hash(): Promise<String> {
    return new Promise((resolve) => resolve("hash"));
  },
}));
interface SutType {
  sut: BCrypterAdapter;
}
const makeSut = (): SutType => {
  const sut = new BCrypterAdapter(12);

  return {
    sut,
  };
};
describe("Bcrypt Adapter", () => {
  test("Should call bcrypt with correct value", async () => {
    const { sut } = makeSut();
    const encryptSpy = jest.spyOn(bcrypt, "hash");
    await sut.encrypt("any_value");
    expect(encryptSpy).toHaveBeenCalledWith("any_value", 12);
  });
  test("Should a hash on success case", async () => {
    const { sut } = makeSut();
    const hash = await sut.encrypt("any_value");
    console.log(hash);
    expect(hash).toBe("hash");
  });
  test("Should throw if bcrypt throws", async () => {
    const { sut } = makeSut();
    jest
      .spyOn(bcrypt, "hash")
      .mockImplementationOnce(() => Promise.reject(new Error()));

    const promise = sut.encrypt("any_value");
    await expect(promise).rejects.toThrow();
  });
});
