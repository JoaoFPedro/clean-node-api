import bcrypt from "bcrypt";
import { BCrypterAdapter } from "./bcrypt";

jest.mock("bcrypt", () => ({
  async hash(): Promise<string> {
    return new Promise((resolve) => resolve("hash"));
  },
  async compare(): Promise<boolean> {
    return new Promise((resolve) => resolve(true));
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
    await sut.hash("any_value");
    expect(encryptSpy).toHaveBeenCalledWith("any_value", 12);
  });
  test("Should a hash on success case", async () => {
    const { sut } = makeSut();
    const hash = await sut.hash("any_value");
    console.log(hash);
    expect(hash).toBe("hash");
  });
  test("Should throw if bcrypt throws", async () => {
    const { sut } = makeSut();
    jest
      .spyOn(bcrypt, "hash")
      .mockImplementationOnce(() => Promise.reject(new Error()));

    const promise = sut.hash("any_value");
    await expect(promise).rejects.toThrow();
  });
  test("Should call bcrypt compare with correct values", async () => {
    const { sut } = makeSut();
    const jestSpy = jest.spyOn(bcrypt, "compare");
    await sut.compare("any_value", "any_hash");
    expect(jestSpy).toHaveBeenCalledWith("any_value", "any_hash");
  });
  test("Should return true on success case", async () => {
    const { sut } = makeSut();
    const isValid = await sut.compare("any_value", "any_hash");

    expect(isValid).toBe(true);
  });
  test("Should return false on fail case", async () => {
    const { sut } = makeSut();
    jest
      .spyOn(bcrypt, "compare")
      .mockReturnValueOnce(Promise.resolve(false) as any);
    const isValid = await sut.compare("any_value", "any_hash");

    expect(isValid).toBe(false);
  });
  test("Should throw if bcrypt throws", async () => {
    const { sut } = makeSut();
    jest
      .spyOn(bcrypt, "compare")
      .mockImplementationOnce(() => Promise.reject(new Error()));

    const promise = sut.compare("any_value", "any_hash");
    await expect(promise).rejects.toThrow();
  });
});
